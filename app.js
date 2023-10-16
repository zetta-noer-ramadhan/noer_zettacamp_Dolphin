const moment = require('moment');
const express = require('express');
const app = express();
const port = 3000;

const { ErrorHandler, RouteErrorHandler } = require('./helper/util');
const db = require('./db/mongo.db');
const graphql = require('./graphql/setup');
const route = require('./route/index.route');

require('./cron/index.job').job;

db.connect();
graphql.init(app);

app.use(express.json());
app.use(route);
app.use(ErrorHandler);
app.use(RouteErrorHandler);
app.listen(port, () => {
    const timestamp = moment().format('HH:mm:ss');
    console.log(`${timestamp} listening on ${port}`);
});
