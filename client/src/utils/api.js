import axios from 'axios';
import { users } from '../testData/users.json';
import { inboxMessages } from '../testData/inboxMessages.json';

axios.defaults.withCredentials = true;


let SERVER_ROOT_URL;
try {
    SERVER_ROOT_URL = new URL(process.env.REACT_APP_SERVER_ROOT_URL);
} catch (err) {
    SERVER_ROOT_URL = new URL('http://localhost:5000/');
}

let CLIENT_ROOT_URL;
try {
    CLIENT_ROOT_URL = new URL(process.env.REACT_APP_CLIENT_ROOT_URL);
} catch (err) {
    CLIENT_ROOT_URL = new URL('http://localhost:3000/');
}

// These functions return test data from local JSON files
// for now. In the future they should make requests to an 
// API on the backend server.

/**
 * 
 * @param {*} _id id of user we want to get username of
 */
function getUsername(_id) {
    for (const user of users) {
        if (user._id === _id) {
            return user.username;
        }
    }
    return null;
}

/**
 * 
 * @param {*} id id of the user we want to get my mixtapes of
 */
async function getMyMixtapes(_id) {
    const mixtapes = await axios.get(new URL('/api/user/mixtapes', SERVER_ROOT_URL), { withCredentials: true });
    return mixtapes.data;
}

/**
 * 
 * @param {*} _id mixtape _id
 */
async function getMixtape(_id) {
    try {
        const mixtape = await axios.get(new URL(`/api/mixtape/${_id}`, SERVER_ROOT_URL));
        return mixtape.data;
    } catch (err) {
        return null;
    }
}

async function updateMixtape(mixtape) {
    await axios.put(new URL(`/api/mixtape/${mixtape._id}`, SERVER_ROOT_URL), { mixtape });
}

async function updateMyMixtapes(mixtapes) {
    await axios.put(new URL(`/api/mymixtapes`, SERVER_ROOT_URL), { mixtapes });
}

async function deleteMixtape(mixtape) {
    console.log(mixtape);
    await axios.delete(new URL(`/api/mixtape/${mixtape._id}`, SERVER_ROOT_URL), { mixtape });
}

async function createMixtape() {
    const mixtape = await axios.post(new URL(`/api/mixtape`, SERVER_ROOT_URL));
    return mixtape;
}

async function forkMixtape(mixtape) {
    const newMixtape = await axios.post(new URL(`/api/mixtape/${mixtape._id}/fork`, SERVER_ROOT_URL), { mixtape });
    //console.log(mixtape);
    //console.log(user);
    /*const forkedMixtape = Object.assign({}, mixtape);
    forkedMixtape.collaborators.push(
        {
            permissions: "editor",
            user: user._id,
            username: user.username
        }
    );
    //console.log(forkedMixtape);
    const newMixtape = await axios.post(new URL(`/api/mixtape`, SERVER_ROOT_URL), { forkedMixtape }); */
    return newMixtape;
}


async function songSearch(api, query) {
    const results = await axios.get(new URL(`/api/${api}/search`, SERVER_ROOT_URL).href, { params: { q: query } });
    return results.data;
}

/**
 * 
 * @param {*} _id id of the user who's favorited mixtapes we want
 */
async function getFavoritedMixtapes(_id) {
    const favoritedMixtapes = await axios.get(new URL(`/api/user/${_id}/favoritedMixtapes`, SERVER_ROOT_URL), { withCredentials: true });
    return favoritedMixtapes.data;
}

async function favoriteMixtape(mixtapeId) {
    const favoritedMixtapes = await axios.put(new URL(`/api/user/favoriteMixtape`, SERVER_ROOT_URL), { id: mixtapeId, withCredentials: true });
    return favoritedMixtapes.data;
}

async function unfavoriteMixtape(mixtapeId) {
    const favoritedMixtapes = await axios.put(new URL(`/api/user/unfavoriteMixtape`, SERVER_ROOT_URL), { id: mixtapeId, withCredentials: true });
    return favoritedMixtapes.data;
}

async function followUser(userId) {
    const followedUsers = await axios.put(new URL(`/api/user/followUser`, SERVER_ROOT_URL), { id: userId, withCredentials: true });
    return followedUsers.data;
}

async function unfollowUser(userId) {
    const followedUsers = await axios.put(new URL(`/api/user/unfollowUser`, SERVER_ROOT_URL), { id: userId, withCredentials: true });
    return followedUsers.data;
}

async function getFollowedUsers(){
    const users = await axios.get(new URL(`/api/user/getFollowedUsers`,SERVER_ROOT_URL), { withCredentials: true });
    return users.data;
}

async function userSignup(email, username, password) {
    try {
        await axios.post(new URL('/api/auth/signup', SERVER_ROOT_URL), { email, username, password });
    } catch(err) { // TODO: error handling
        console.log(err);
    }
}

async function userLogin(username, password) {
    await axios.post(new URL('/api/auth/login', SERVER_ROOT_URL), { username, password });
}

async function userLogout() {
    await axios.post(new URL('/api/auth/logout', SERVER_ROOT_URL));
}

async function userVerifyAccount(token) {
    await axios.put(new URL('/api/auth/verify', SERVER_ROOT_URL), { token });
}

async function verifyUserLoggedIn() {
    const user = await axios.get(new URL('/api/auth/login/success', SERVER_ROOT_URL).href);
    return user.data;
}

async function requestPasswordReset(email) {
    await axios.put(new URL('/api/auth/resetPassword', SERVER_ROOT_URL).href, { email });
}

// reset password by email
async function resetPassword(token, password) {
    await axios.put(new URL('/api/auth/resetPassword', SERVER_ROOT_URL).href, { password, token });
}

// change password through account settings
async function changePassword(currentPassword, newPassword) {
    await axios.put(new URL('/api/auth/changePassword', SERVER_ROOT_URL).href, { currentPassword, newPassword });
}

async function setUsernameOfOAuthAccount(username) {
    await axios.put(new URL('/api/auth/setOAuthUsername', SERVER_ROOT_URL).href, { username });
}

async function uploadFile(file, filename, endpoint) {
    const formData = new FormData();
    formData.append(filename, file);
    await axios.put(new URL(endpoint, SERVER_ROOT_URL), formData);
}

function getMixtapeCoverImageUrl(mixtapeId) {
    return new URL(`/api/mixtape/${mixtapeId}/coverImage`, SERVER_ROOT_URL).href;
}

function getUserProfilePictureUrl(userId) {
    return new URL(`/api/user/${userId}/profilePicture`, SERVER_ROOT_URL).href;
}

async function getSongDuration(api, itemId) {
    const songDuration = await axios.get(new URL(`/api/${api}/itemDuration`, SERVER_ROOT_URL).href, { params: { itemId } });
    return songDuration.data;
}

async function adminFillDatabase() {
    await axios.post(new URL('/api/admin/populateDatabase', SERVER_ROOT_URL).href);
}

async function adminDropDatabase() {
    await axios.post(new URL('/api/admin/dropDatabase', SERVER_ROOT_URL).href);    
}
async function getAdmins(){
    const users = await axios.get(new URL('/api/admin/getAdmins',SERVER_ROOT_URL), { withCredentials: true });
    return users.data;
}


async function deleteAdmin(userId) {
    const users = await axios.put(new URL('/api/admin/deleteAdmin', SERVER_ROOT_URL), { userId });
    return users.data;
}

async function addAdmin(userId) {
    const users = await axios.put(new URL('/api/admin/addAdmin', SERVER_ROOT_URL), { userId });
    return users.data;
}

async function getUser(userId) {
    if (userId.charAt(0) === '#') {
        if (userId.length === 5) {
            userId = `!${userId.substring(1)}`;
        } else {
            return null;
        }
    }
    const user = await axios.get(new URL(`/api/user/${userId}`, SERVER_ROOT_URL).href);
    return user.data;
}

async function queryForMixtapes(query) {
    const mixtapes = await axios.get(new URL(`/api/mixtape/queryMixtapes`, SERVER_ROOT_URL).href, { params: query });
    return mixtapes.data;
}

// search for a user
async function userSearch(searchQuery) {
    const users = await axios.get(new URL('/api/user/search', SERVER_ROOT_URL).href, { params: { query: searchQuery } });
    return users.data;
}

async function mixtapeSearch(searchQuery) {
    const mixtapes = await axios.get(new URL('/api/mixtape/search', SERVER_ROOT_URL).href, { params: { query: searchQuery } });
    return mixtapes.data;
}

function oauthLogin(provider) {
    window.location.href = new URL(`/api/auth/${provider}`, SERVER_ROOT_URL).href;
}

function getMixtapeUrl(mixtapeId) {
    return new URL(`/api/mixtape/${mixtapeId}`, CLIENT_ROOT_URL).href;
}

async function createListeningRoom(mixtapeId) {
    const listeningRoomId = await axios.post(new URL('/api/listeningroom', SERVER_ROOT_URL).href, { mixtapeId });
    return listeningRoomId.data;
}

async function getListeningRoom(listeningRoomId) {
    const listeningRoom = await axios.get(new URL(`/api/listeningroom/${listeningRoomId}`, SERVER_ROOT_URL).href);
    return listeningRoom.data;
}

async function sendAnonymousMessage(mixtapeId, recipient, message) {
    await axios.post(new URL('/api/user/sendMessage', SERVER_ROOT_URL).href, { recipient, message, mixtapeId });
}

async function deleteInboxMessage(messageId) {
    const messages = await axios.delete(new URL(`/api/user/deleteMessage/${messageId}`, SERVER_ROOT_URL).href);
    return messages.data;
}

async function getInboxMessages() {
    const messages = await axios.get(new URL('/api/user/inboxMessages', SERVER_ROOT_URL).href);
    return messages.data;
}

async function getRandomMixtapes(count) {
    const mixtapes = await axios.get(new URL('/api/mixtape/random', SERVER_ROOT_URL).href, { params: { count } });
    return mixtapes.data;
}

export {
    createMixtape,
    deleteMixtape,
    favoriteMixtape,
    unfavoriteMixtape,
    getUser,
    getUsername,
    followUser,
    unfollowUser,
    getFollowedUsers,
    getMixtape,
    getMixtapeUrl,
    getMixtapeCoverImageUrl,
    getUserProfilePictureUrl,
    getMyMixtapes,
    getFavoritedMixtapes,
    getInboxMessages,
    queryForMixtapes,
    songSearch,
    getSongDuration,
    setUsernameOfOAuthAccount,
    verifyUserLoggedIn,
    updateMixtape,
    updateMyMixtapes,
    oauthLogin,
    userLogin,
    userLogout,
    userSignup,
    userVerifyAccount,
    requestPasswordReset,
    resetPassword,
    changePassword,
    uploadFile,
    adminFillDatabase,
    adminDropDatabase,
    userSearch,
    mixtapeSearch,
    getAdmins,
    deleteAdmin,
    addAdmin,
    createListeningRoom,
    getListeningRoom,
    forkMixtape,
    sendAnonymousMessage,
    deleteInboxMessage,
    getRandomMixtapes,
};
