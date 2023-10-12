const { ApolloError } = require('apollo-server-express');
const DataLoader = require('dataloader');

const playlistService = require('../../service/playlist.service');
const songService = require('../../service/song.service');
const userService = require('../../service/user.service');

const Loader = (service, field) =>
    new DataLoader(async (keys) => {
        const data = await service(keys);

        if (data && data.err) throw new ApolloError('db error');

        const dataMap = new Map();

        data.forEach((item) => dataMap.set(String(item[field]), item));

        return keys.map((key) => dataMap.get(String(key)) || null);
    });

const playlistLoader = Loader(playlistService.GetAllByIds, '_id');
const songLoader = Loader(songService.GetAllByIds, '_id');
const userLoader = Loader(userService.GetAllByUsernames, 'username');

module.exports = {
    songLoader,
    playlistLoader,
    userLoader,
};
