const moment = require('moment');
const { CronJob } = require('cron');
const songModel = require('../model/song.model');
const cronEnabled = true;

const job = new CronJob(
    '*/5 * * * * *',
    async function () {
        if (cronEnabled) {
            await SongPlayer();
        } else {
            console.log('cron not enabled');
        }
    },
    null,
    true,
    'Asia/Jakarta'
);

const SongPlayer = async () => {
    const timestamp = moment().format('HH:mm:ss');
    try {
        const data = await songModel.aggregate([
            { $match: { played: true } },
            { $sort: { title: 1, _id: 1 } },
            { $limit: 1 },
            { $set: { played: false } },
        ]);

        if (!data || !data.length) {
            console.log(timestamp, '[NOW] No Song To Be Played');
        } else {
            const { _id, title, artist_name } = data[0];
            if (!_id || !title || !artist_name) {
                console.log(timestamp, '[ERR] Error when fetching song data');
            } else {
                console.log(timestamp, '[NOW]', title, 'by', artist_name);
                await songModel.findByIdAndUpdate(_id, ...data);
            }
        }
    } catch (error) {
        console.log(timestamp, '[ERR] Error when playing song', error);
    }
};

const jobsFunctionList = {
    song_player: SongPlayer,
};

const jobsList = {
    song_player: job,
};

module.exports = { jobsList, jobsFunctionList };
