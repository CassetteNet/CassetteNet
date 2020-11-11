const soundcloud = require('soundcloud-downloader');

async function searchSong(song) {
    const songs = await soundcloud.search('tracks', song);
    return songs.collection;
}

async function getSongInfo(songId) {
    const songInfo = await soundcloud.getTrackInfoByID([songId]);
    if (songInfo.length === 1) {
        return songInfo[0];
    } else {
        return null;
    }
}

module.exports = {
    getSongInfo,
    searchSong
}
