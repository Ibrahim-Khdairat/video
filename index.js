'use strict';

const dotenv =require('dotenv');
dotenv.config();
require('./src/server.js').startup(3000);
