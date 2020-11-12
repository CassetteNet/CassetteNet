const express = require('express');
const { Types } = require('mongoose');
const textToPicture = require('text-to-picture-kazari');
const { Mixtape, User } = require('../models');

const router = express.Router();


router.put('/:id/coverImage', async (req, res) => {
    if (!req.files || !req.files.coverImage) return res.status(400).send('no file uploaded.');
    const { coverImage } = req.files;
    await Mixtape.findByIdAndUpdate(req.params.id, { coverImage: { data: coverImage.data, contentType: coverImage.mimetype } });
    const mixtape = await Mixtape.findById(req.params.id);
    res.send(mixtape);
});


router.get('/:id/coverImage', async (req, res) => {
    const mixtape = await Mixtape.findById(req.params.id).select('+coverImage');
    if (mixtape && mixtape.coverImage) {
        res.set('Content-Type', mixtape.coverImage.contentType);
        res.send(mixtape.coverImage.data.buffer);
    } else if (mixtape) {
        const image = await textToPicture.convert({
            text: mixtape.name,
            size: 32,
            quality: 100,
        });
        const buf = await image.getBuffer()
        res.send(buf);
    } else {
        res.status(404).send('mixtape not found');
    }
});


// executes mongoose query based on query string values
router.get('/searchMixtapes', async (req, res) => {
    let mixtapes = await Mixtape.find(req.query).lean();
    // only return mixtapes the user has permission to view
    if (req.user) {
        mixtapes = mixtapes.filter(mixtape => {
            if (mixtape.isPublic) return true;
            for (const collaborator of mixtape.collaborators) {
                if (collaborator.user === req.user.id) return true;
            }
            return false;
        })
    } else {
        mixtapes = mixtapes.filter(mixtape => mixtape.isPublic);
    }
    for (const mixtape of mixtapes) {
        const favoriteCount = (await User.find({ favoritedMixtapes: mixtape._id }).lean()).length;
        mixtape.favorites = favoriteCount;
    }
    res.send(mixtapes);
});



// CREATE MIXTAPE
router.post('/', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtape = {
        name: 'New Mixtape',
        collaborators: [{ user: req.user.id, permissions: 'owner', username: req.user.username }],
        songs: [],
        isPublic: true // TODO: set default to false, true for now to make testing easier
    };
    const mixtapeObject = await Mixtape.create(mixtape);
    return res.send(mixtapeObject);
});

// RETRIEVE MIXTAPE
router.get('/:id', async (req, res) => {
    const mixtape = await Mixtape.findOne({ _id: (req.params.id) }).lean();
    return res.send(mixtape);
});

// UPDATE MIXTAPE
router.put('/:id', async (req, res) => {
    const { mixtape } = req.body;
    for (const collaborator of mixtape.collaborators) {
        collaborator.user = Types.ObjectId(collaborator.user);
    }
    await Mixtape.findOneAndUpdate({  _id: mixtape._id }, mixtape);
    return res.send(mixtape);
});

// DELETE MIXTAPE
router.delete('/:id', async (req, res) => {
    // const { mixtape } = req.body;
    const mixtape = await Mixtape.findOne({ _id: req.params.id });
    await Mixtape.deleteOne({  _id: mixtape._id });
    const users = await User.find({ favoritedMixtapes: { $in: mixtape._id } });
    for (const user of users) {
        const newarr = user.favoritedMixtapes.filter(favoritedMixtape => favoritedMixtape._id != req.params.id);
        user.favoritedMixtapes = newarr;
        user.save();
    }
    return res.send(mixtape);
});

module.exports = router;
