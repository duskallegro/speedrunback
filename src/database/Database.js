var pg = require('pg');

const express = require('express');
const {user, password, host, port, database} = require('../../config');

class Database  {
    user;
    password;
    host;
    port;
    database;

    pool;

    constructor() {
        this.user = 'thecopper';
        this.password = 'bigfalcon';
        this.host = 'localhost';
        this.port = '5432';
        this.database = 'speedrun';

        this.setup();
    }

    setup()  {
        this.pool = new pg.Pool({
            user: this.user,
            password: this.password,
            host: this.host,
            port: this.port,
            database: this.database
        });

        this.pool.on('connect', () =>  {
           console.log("Connected!");
        });
    }

    query(text, params)  {
        return this.pool.query(text, params);
    }
}

module.exports = Database;