const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT,
    base_url: process.env.BASE_URL,
    mongodb_uri: process.env.MONGODB_URI,
};