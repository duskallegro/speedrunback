const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const {addAsync} = require('@awaitjs/express');

const Database = require("../database/Database");
const UsersDatabase = require('../database/UsersDatabase');
const LangDatabase = require('../database/LangDatabase');
const WordPairsDatabase = require('../database/WordPairsDatabase');
const WordPadDatabase = require('../database/WordPadDatabase');

const server = express();

server.use(morgan('combined'));

server.use(morgan('combined'));
server.use(bodyParser.json());
server.use(cors());

// databases

let usersDatabase = new UsersDatabase();
let wordPadDatabase = new WordPadDatabase();
let wordPairsDatabase = new WordPairsDatabase();
let langDatabase = new LangDatabase();

// paths

// get requests

server.get('/test', (req, res) => {
    res.json({message: "Testing..."})
});

server.get('/users', async (req, res) =>  {
    let users = await usersDatabase.getAllUsers();
    console.log(users);
    res.json({message: users});
});

server.get('/userbydiscordid', async(req, res) =>  {
    const discordId = req.query.discordId;
    let user = await usersDatabase.getUserByDiscordId(discordId);
    res.json({message: user});
});

server.get('/userbyusername', async(req, res) =>  {
    const username = req.query.username;
    let user = await usersDatabase.getUserByUsername(username);
    res.json({message: user});
});

server.get('/pairsbypadid', async(req, res) =>  {
   const padId = req.query.padId;
   let pairs = await wordPairsDatabase.getWordPairsByPadId(padId);
   console.log(pairs);
   res.json({message: pairs});
});

server.get('/userwordpads', async (req, res) =>  {
    const discordId= req.query.discordId;

    try {
        let userId = usersDatabase.getUserIdByDiscordId(discordId);
        if (userId !== null) {
            let pads = await wordPadDatabase.getWordPadsByDiscordId(discordId);
            res.json({message: pads});
        }
    } catch (e)  {
        console.log(e);
        return [];
    }
});

// post requests

server.post('/createpair', async (req, res) =>  {
    let discordId = req.body['discordId'];
    let foreignLang = req.body.foreignLang;
    let translationLang = req.body.translationLang;
    let foreignWord = req.body.foreignWord;
    let translation = req.body.translation;

    let discordTag = req.body.discordTag;

    console.log(discordId);
    let result = await wordPairsDatabase.createWordPairByDiscordId(discordId, foreignLang, translationLang,
        foreignWord, translation, discordTag);
    res.json({message: result});
});

server.listen(process.env.PORT || 8082);
