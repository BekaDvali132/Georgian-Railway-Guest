const Pool = require('pg').Pool;


const pool = new Pool({
    user: 'postgres',
    password: '8008',
    host: 'localhost',
    port: 5432,
    database: 'georgianrailway'
});

module.exports = pool;