const { Types } = require('mongoose');
const { ListeningRoom, User } = require('./models');


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
                lr.currentListeners.push({ user: Types.ObjectId(user._id), ready: false });
            }
            lr.chatMessages.push({
                message: `${user.username} joined the room!`,
                timestamp: Date.now(),
                from: { username: '#ChatBot' }, // will always be unique since usernames aren't allowed to start with #
            });
            await lr.save();
            socket.emit('userJoinedOrLeft');
            socket.to(listeningRoom._id).to(defaultRoom).emit('userJoinedOrLeft');
            socket.to(listeningRoom._id).to(defaultRoom).emit('newChatMessage', lr.chatMessages);
            if (lr.startedAt && lr.wasAt) {
                socket.emit('playSong', { index: lr.currentSong, timestamp: {startedAt: lr.startedAt, wasAt: lr.wasAt } });
            }
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
                lr.currentListeners = lr.currentListeners.filter(u => !u.user.equals(user._id));
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

        // socket.on('playSong', async () => {
        //     const roomId = socket.rooms.values().next().value;
        //     const listeningRoom = await ListeningRoom.findById(roomId);

        //     if (listeningRoom.owner.equals(user._id)) {
        //         io.in(roomId).emit('playSong');
        //     }
        // });

        // socket.on('pauseSong', async ({ timestamp }) => {
        //     const roomId = socket.rooms.values().next().value;
        //     const listeningRoom = await ListeningRoom.findById(roomId);

        //     if (listeningRoom.owner.equals(user._id)) {
        //         io.in(roomId).emit('pauseSong', { timestamp });
        //     }
        // });

        // socket.on('seekSong', async ({ timestamp }) => {
        //     const roomId = socket.rooms.values().next().value;
        //     const listeningRoom = await ListeningRoom.findById(roomId);

        //     if (listeningRoom.owner.equals(user._id)) {
        //         io.in(roomId).emit('seekSong', { timestamp });
        //     }
        // });

        socket.on('changeSong', async (index) => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);
            if (listeningRoom) {
                listeningRoom.currentSong = index;
                if (listeningRoom.rhythmGameQueue.length > 0) {
                    io.in(roomId).emit('rhythmGameAboutToBegin');
                }
                listeningRoom.startedAt = null;
                listeningRoom.wasAt = null;
                for (const listener of listeningRoom.currentListeners) {
                    listener.ready = false;
                }
                listeningRoom.markModified('currentListeners');
                await listeningRoom.save();
                console.log(listeningRoom.currentListeners);
                console.log('emiiting......')
                io.in(roomId).emit('changeSong', index);
            }
        });

        socket.on('queueRhythmGame', async () => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            if (!listeningRoom.rhythmGameQueue.includes(Types.ObjectId(user._id))) {
                listeningRoom.rhythmGameQueue.push({ user: user._id, ready: false });
                await listeningRoom.save();
            }
        });

        socket.on('songIsLoaded', async () => {
            console.log(user.username);
            const lrIds = Array.from(socket.rooms).filter(room => Types.ObjectId.isValid(room));
            if (!lrIds || lrIds.length === 0) return;
            const lrId = lrIds[0];
            // const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(lrId);
            let allReady = true; // whether all connected clients are ready to begin song playback
            for (const queuedUser of listeningRoom.rhythmGameQueue) {
                if (queuedUser.user.equals(user._id)) {
                    queuedUser.ready = true;
                    listeningRoom.markModified('rhythmGameQueue');
                    break;
                }
            }
            for (const listener of listeningRoom.currentListeners) {
                if (listener.user.equals(user._id)) {
                    listener.ready = true;
                    listeningRoom.markModified('currentListeners');
                } else if (!listener.ready) {
                    allReady = false;
                }
            }
            console.log(listeningRoom.currentListeners);
            if (allReady && !listeningRoom.startedAt) {
                io.in(lrId).emit('playSong');
                listeningRoom.startedAt = Date.now() / 1000;
                listeningRoom.wasAt = 0;
            }
            await listeningRoom.save();
        });
    });
}

module.exports = initSockets;
