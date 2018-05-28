const compression = require('compression');
const express = require('express');
const config = require('../config');
const port = config.publish.port;
const app = express();
const cors = require('cors');

app.use(require('connect-history-api-fallback')());
app.use(compression());
app.use(cors(config.publish.cors));

const cacheDuration = 1000 * 60 * 60;
app.use(express.static('./dist' , {maxAge: cacheDuration} ));
console.log('server start with Express , port : ' + port);
app.listen(port);
