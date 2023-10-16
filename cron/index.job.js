const { CronJob } = require('cron');
const moment = require('moment');

const cronEnabled = true;

// const Job = () => {
//     const now = moment();
//     const pattern = `${now.second()} ${now.minutes()}/5 * * * *`;
//     console.log(pattern);

//     return new CronJob(
//         pattern,
//         async function () {
//             if (cronEnabled) {
//                 await SongPlayer(this);
//             } else {
//                 console.log('cron not enabled');
//             }
//         },
//         null,
//         true,
//         'Asia/Jakarta',
//         { playlist: [], currentIndex: 0 }
//     );
// };

// console.log(moment().format('HH:mm:ss'), 'from job')

const Job = new CronJob(
    '*/1 * * * *',
    async function () {
        if (cronEnabled) {
            await SongPlayer(this);
        } else {
            console.log('cron not enabled');
            // this.stop()
        }
    },
    null,
    true,
    'Asia/Jakarta',
    { playlist: [], currentIndex: 0 }
);

// const songModel = require('../model/song.model');
const songService = require('../service/song.service');

const SongPlayer = async (context) => {
    const timestamp = moment().format('HH:mm:ss');
    try {
        // const data = await songModel.findOneAndUpdate({ played: false }, { played: true });

        if (!context.playlist.length) {
            context.playlist = await songService.GetAll({ played: false });
            context.currentIndex = 0;
        }

        const data = context.playlist[context.currentIndex++];

        if (!data) {
            console.log(timestamp, '[NOW] No Song To Be Played');
        } else {
            const { _id, title, artist_name } = data;
            if (!_id || !title || !artist_name) {
                console.log(timestamp, '[ERR] Error when fetching song data');
            } else {
                console.log(timestamp, '[NOW]', data.title, 'by', data.artist_name);
                await songService.UpdateById(data._id, { played: true });
            }
        }
    } catch (error) {
        console.log(timestamp, '[ERR] Error when fetching song data', error);
    }
};

module.exports = Job;
