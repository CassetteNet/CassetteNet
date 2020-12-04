const express = require('express');
const { Types } = require('mongoose');
const textToPicture = require('text-to-picture-kazari');
const { Mixtape, User } = require('../models');

const PAGINATION_COUNT = process.env.PAGINATION_COUNT || 10;

const router = express.Router();

/**
 * Determines whether a given user has permission to view a given mixtape
 * @param {*} user 
 * @param {*} mixtape 
 */
function isAuthorized(user, mixtape) {
    if (mixtape.isPublic) return true;
    if (!user) return false;
    for (const collaborator of mixtape.collaborators) {
        if (collaborator.user.equals(user._id)) {
            return true;
        }
    }
    return false;
}


/**
 * Fisher-Yates algorithm for shuffling arrays
 */
function getRandomSubarray(arr, size) {
    const shuffled = [...arr];
    let i = arr.length;
    let temp;
    let index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

router.get('/random', async (req, res) => {
    const { count } = req.query;
    const mixtapes = await Mixtape.find({ isPublic: true }).lean();
    res.send(getRandomSubarray(mixtapes, count));
});

router.get('/popular', async (req, res) => {
    const { count } = req.query;
    console.log("count: " + count);
    const mixtapes = await Mixtape.find({ isPublic: true }).lean();
    console.log("mixtapes in router: " + mixtapes);
    res.send(getRandomSubarray(mixtapes, count));
});

router.put('/:id/coverImage', async (req, res) => {
    if (!req.files || !req.files.coverImage) return res.status(400).send('no file uploaded.');
    const { coverImage } = req.files;
    await Mixtape.findByIdAndUpdate(req.params.id, { coverImage: { data: coverImage.data, contentType: coverImage.mimetype } });
    const mixtape = await Mixtape.findById(req.params.id).lean();
    res.send(mixtape);
});


router.get('/:id/coverImage', async (req, res) => {
    const mixtape = await Mixtape.findById(req.params.id).select('+coverImage').lean();
    if (mixtape && mixtape.coverImage) {
        res.set('Content-Type', mixtape.coverImage.contentType);
        res.send(mixtape.coverImage.data.buffer);
    } else if (mixtape) {
        const image = await textToPicture.convert({
            text: mixtape.name,
            size: 32,
            quality: 100,
            source: {
                height: 256,
                width: 256,
                background: 0xFFFFFFFF,
            },
        });
        const buf = await image.getBuffer()
        res.send(buf);
    } else {
        res.status(404).send('mixtape not found');
    }
});


// get mixtapes owned by a certain user
router.get('/createdMixtapes', async (req, res) => {
    const { userId } = req.query;
    let mixtapes = await Mixtape.find({ 'collaborators.user': Types.ObjectId(userId), 'collaborators.permissions': 'owner' }).lean();
    
    // TODO: figure out why db query isn't working. filter here for now.
    mixtapes = mixtapes.filter(mixtape => {
        for (const collaborator of mixtape.collaborators) {
            if (collaborator.permissions === 'owner' && collaborator.user.toString() === userId) {
                return true;
            }
        }
        return false;
    });

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



router.get('/search', async (req, res) => {
    const { query, page } = req.query;
    if (!query) return res.status(400).send('missing search query');
    const results = await Mixtape.paginate(Mixtape.searchBuilder(query), { lean: true, limit: PAGINATION_COUNT, page: page ? page : 1 });
    const resultsAuthorized = results.docs.filter(mixtape => isAuthorized(req.user, mixtape));
    res.send({
        results: resultsAuthorized,
        currentPage: results.page,
        totalPages: Math.floor(resultsAuthorized.length / PAGINATION_COUNT),
        totalResults: resultsAuthorized.length,
    });
});



// CREATE MIXTAPE
router.post('/', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtape = {
        name: 'New Mixtape',
        collaborators: [{ user: req.user._id, permissions: 'owner', username: req.user.username }],
        songs: [],
        isPublic: true // TODO: set default to false, true for now to make testing easier
    };
    const mixtapeObject = await Mixtape.create(mixtape);
    return res.send(mixtapeObject);
});

// FORK MIXTAPE
router.post('/:id/fork', async (req, res) => {
    if (!req.user) return res.status(401).send([]);

    const mixtape = await Mixtape.findById(req.params.id).lean();

    const newMixtape = {
        name: mixtape.name,
        collaborators: [{ user: req.user._id, permissions: 'owner', username: req.user.username }],
        songs: mixtape.songs,
        isPublic: true // TODO: set default to false, true for now to make testing easier
    };

    const mixtapeObject = await Mixtape.create(newMixtape);
    return res.send(mixtapeObject);
});

// RETRIEVE MIXTAPE
router.get('/:id', async (req, res) => {
    try {
        const mixtape = await Mixtape.findOne({ _id: (req.params.id) }).lean();
        if (!mixtape) return res.status(404).send('not found'); // if mixtape doesn't exist
        if (!mixtape.isPublic) { // if mixtape isn't public, make sure this user is authorized to view it
            if (!req.user) return res.status(401).send('unauthorized');
            for (const collaborator of mixtape.collaborators) {
                if (collaborator.user.equals(req.user._id)) {
                    return res.send(mixtape);
                }
            }
            // if the user wasn't found in collaboraters, they aren't allowed to view the mixtape
            return res.status(401).send('unauthorized');
        }
        return res.send(mixtape);
    } catch(err) {
        res.status(400).send(err);
    }
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
    const mixtape = await Mixtape.findOne({ _id: req.params.id }).lean();
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
