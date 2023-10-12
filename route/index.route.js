const router = require('express').Router();
const songService = require('../service/song.service');
const { GenerateToken, CheckAuthJWTREST } = require('../middleware/auth.middleware');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({ message: 'no username or password' });
    }

    const config = {
        username: 'uname',
        passowrd: 'pword',
    };

    if (config.username !== username || config.passowrd !== password) {
        return res.status(401).json({ message: 'wrong username or password' });
    }

    const token = await GenerateToken(username);
    if (!token) {
        return res.status(500).jaon({ message: 'no token' });
    }

    return res.status(200).json({ token });
});

router.post('/hook', CheckAuthJWTREST, async (req, res) => {
    const { songs_data } = req.body;
    if (!songs_data || !songs_data.length) {
        return res.status(400).json({ message: 'bad params: body' });
    }

    if (!req.user) {
        return res.status(401).json({ message: 'auth: no auth' });
    }

    const { token } = req.user;
    if (!token) {
        return res.status(401).json({ message: 'auth: no auth token' });
    }

    const config = {
        webhook_url: 'https://webhook.site/c430248a-7817-4d52-b011-0bc6132e2ca1',
        options: {
            method: 'POST',
            body: JSON.stringify(songs_data),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${req.user.token}`,
            },
        },
    };

    return await fetch(config.webhook_url, config.options)
        .then(async (response) => {
            if (!response) {
                res.status(500).json({ message: 'not ok: fetch response' });
            }

            if (response.ok && response.status === 200) {
                updateManySongs(songs_data);
            }

            console.log('ok: fetch response', response.status, response.statusText);
            return res.status(response.status).json({ message: `ok: webhook, ${response.statusText}` });
        })
        .catch((err) => {
            return res.status(500).json({ message: 'not ok: fetch error', err });
        });
});

const updateManySongs = async (songsData) => {
    if (!songsData || !songsData.length) {
        console.log('bad params: songsData');
        return { status: 400, data: null };
    }

    const result = [];
    songsData.forEach(async (song) => {
        if (!song) {
            console.log('bad params: songsData[i]');
            return { status: 400, data: null };
        }

        const { song_id, song_update } = song;
        if (!song_id || !song_update) {
            console.log('bad params: songsData[i].field');
            return { status: 400, data: null };
        }

        const { title, artist_name, album_name, year, genre, duration } = song_update;
        if (!title && !artist_name && !album_name && !year && !genre && !duration) {
            console.log('bad params: songsData[i].songs_update.field');
            return { status: 400, data: null };
        }

        songService
            .UpdateById(song_id, song_update)
            .catch(() => {
                console.log('not ok: song update error');
            })
            .then((data) => {
                if (!data) {
                    console.log('not ok: song update data');
                    return { status: 400, data: null };
                }
                console.log('update: ongoing\t', data.id);
                result.push(data);
                return data;
            })
            .then((data) => {
                console.log('update: done\t', data.id);
                return data;
            });
    });

    console.log('ok: updateManySongs');
    return { status: 200, data: result };
};

module.exports = router;
