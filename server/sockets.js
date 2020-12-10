const { Types } = require('mongoose');
const axios = require('axios');
const { ListeningRoom, User } = require('./models');
const { getAudioAnalysisFromYoutube } = require('./external_apis/spotify');

let STREAM_SERVER_ROOT_URL;
try {
    STREAM_SERVER_ROOT_URL = new URL(process.env.STREAM_SERVER_ROOT_URL).href;
} catch (err) {
    STREAM_SERVER_ROOT_URL = new URL('http://localhost:5001/').href;
}


function initSockets(io) {
    io.on('connection', async (socket) => {
        const { user } = socket.request; // user object from passport, generated from `passportSocketIo.authorize` in app.js

        socket.on('setUserSocketId', async () => {
            const userDb = await User.findById(user._id);
            userDb.socketId = socket.id;
            await userDb.save();
        });

        socket.on('joinListeningRoom', async ({ listeningRoom }) => {
            const defaultRoom = socket.rooms.values().next().value;
            socket.join(listeningRoom._id);
            const lr = await ListeningRoom.findById(listeningRoom._id);

            if (!lr.currentListeners.map(l => l.user).includes(Types.ObjectId(user._id))) {
                lr.currentListeners.push(Types.ObjectId(user._id));
            }
            lr.chatMessages.push({
                message: `${user.username} joined the room!`,
                timestamp: Date.now(),
                from: { username: '#ChatBot' }, // will always be unique since usernames aren't allowed to start with #
            });
            if (!lr.startedAt) {
                lr.startedAt = Date.now() / 1000 + 4;
                lr.wasAt = 0;
            }
            await lr.save();
            socket.emit('userJoinedOrLeft');
            socket.to(listeningRoom._id).to(defaultRoom).emit('userJoinedOrLeft');
            socket.to(listeningRoom._id).to(defaultRoom).emit('newChatMessage', lr.chatMessages);
            socket.leave(defaultRoom); // leave the default room that socket.io creates
        });

        socket.on('sendChatMessage', async ({ message, timestamp }) => {
            const roomId = socket.rooms.values().next().value;

            const from = { user: user._id, username: user.username };
            const listeningRoom = await ListeningRoom.findById(roomId);
            listeningRoom.chatMessages.push({ message, timestamp, from });

            await listeningRoom.save();

            io.in(roomId).emit('newChatMessage', listeningRoom.chatMessages);
        });

        socket.on('disconnecting', async () => {
            // get id of listening room user disconnected from
            const lrIds = Array.from(socket.rooms).filter(room => Types.ObjectId.isValid(room));
            if (!lrIds || lrIds.length === 0) return;
            const lrId = lrIds[0];
            const lr = await ListeningRoom.findById(lrId);
            if (lr) {
                // remove user from listening room in database
                lr.currentListeners = lr.currentListeners.filter(u => !u.equals(user._id));
                lr.chatMessages.push({
                    message: `${user.username} has left the room.`,
                    timestamp: Date.now(),
                    from: { username: '#ChatBot' }, // will always be unique since usernames aren't allowed to start with #
                });
                await lr.save();
                socket.to(lrId).emit('userJoinedOrLeft');
                if (lr.owner.equals(user._id)) {
                    io.in(lrId).emit('endListeningRoom');
                    await lr.deleteOne();
                }
            }

            const userDb = await User.findById(user._id);
            userDb.set('socketId', null);
            await userDb.save();
        });

        socket.on('sendInboxMessage', async ({ recipientId }) => {
            const userReceivingMessage = await User.findById(recipientId).lean();
            if (userReceivingMessage && userReceivingMessage.socketId) {
                io.to(userReceivingMessage.socketId).emit('newInboxMessage'); // notify user that they have a new message
            }
        });

        socket.on('changeSong', async (index) => {
            console.log('changeSong ' + index)
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);
            if (listeningRoom && listeningRoom.owner && listeningRoom.owner.equals(user._id)) {
                listeningRoom.currentSong = index;
                if (listeningRoom.rhythmGameQueue.length > 0) {
                    // const analysis = await getAudioAnalysisFromYoutube(listeningRoom.mixtape.songs[index].id);
                    // console.log(analysis);
                    // listeningRoom.mixtape.songs[index].bpm = analysis.track.tempo;
                    listeningRoom.mixtape.songs[index].bpm = 60; // TODO: actually calculate this
                    io.in(roomId).emit('rhythmGameAboutToBegin');
                }
                listeningRoom.startedAt = null;
                listeningRoom.wasAt = null;
                let livestreamId;
                try {
                    livestreamId = await axios.post(new URL('/startStream', STREAM_SERVER_ROOT_URL).href,
                        {
                            type: listeningRoom.mixtape.songs[index].type,
                            id: listeningRoom.mixtape.songs[index].id,
                            listeningRoomId: roomId,
                            index,
                        }
                    );
                } catch (err) {
                    return;
                }
                const listeningRoomPlaybackUrl = new URL(`/stream/live/${livestreamId.data}.flv`, STREAM_SERVER_ROOT_URL).href;
                listeningRoom.mixtape.songs[index].listeningRoomPlaybackUrl = listeningRoomPlaybackUrl;
                listeningRoom.markModified('currentListeners');
                listeningRoom.markModified('mixtape.songs');
                listeningRoom.startedAt = (Date.now() / 1000) + 4; // its usually off by about 4 seconds
                listeningRoom.wasAt = 0;
                await listeningRoom.save();
                io.in(roomId).emit('changeSong', { index, url: listeningRoomPlaybackUrl });
            }
        });

        socket.on('queueRhythmGame', async () => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            if (!listeningRoom.rhythmGameQueue.includes(Types.ObjectId(user._id))) {
                listeningRoom.rhythmGameQueue.push(Types.ObjectId(user._id));
                await listeningRoom.save();
            }
        });
    });
}

module.exports = initSockets;
