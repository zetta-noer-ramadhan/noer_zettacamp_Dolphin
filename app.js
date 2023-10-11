const express = require('express');
const app = express();
const port = 3000;

const db = require('./db/mongo.db');
const graphql = require('./graphql/setup');

db.connect();
graphql.init(app);

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
