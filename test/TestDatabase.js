const WordPadDatabase = require('../src/database/WordPadDatabase');
const UsersDatabase = require('../src/database/UsersDatabase');
const LangDatabase = require('../src/database/LangDatabase');
const WordPairsDatabase = require('../src/database/WordPairsDatabase');

(async () => {
    let wordPadDatabase = new WordPadDatabase();
    let usersDatabase = new UsersDatabase();
    let langDatabase = new LangDatabase();
    let wordPairsDatabase = new WordPairsDatabase();

    /*let users = await usersDatabase.getAllUsers();
    console.log(users);

    let langs = await langDatabase.getAllLangs();
    console.log(langs);

    //let lang_id = await langDatabase.createLang('russian');
    //console.log(lang_id);

    let user_id = await usersDatabase.createUser('1234567');
    console.log(user_id);

    let user_id_real = await usersDatabase.getUserIdByDiscordId('123456');
    console.log("id real: " + user_id_real);

    let lang_id_real = await langDatabase.getLangIdByName('english');
    console.log("lang id real: " + lang_id_real);

    let pad_create_res = await wordPadDatabase.createWordPad('123456',
        'spanish', 'english');
    console.log("pad created: " + pad_create_res);

    let padReal = await wordPadDatabase.getWordPadByDiscordUserIdAndLangs('123456',
        'spanish', 'english');
    console.log(padReal);

    let pairCreation = await wordPairsDatabase.createWordPairByDiscordId('195330384551084032',
        'spanish', 'russian', 'perro', 'dog');
    console.log(pairCreation);*/

    //usersDatabase.createUser('444', '');
    //usersDatabase.createUser('33', 'test#33');

  //  usersDatabase.updateUserByDiscordId('44', 'wow#444');

   // console.log(await wordPadDatabase.getWordPadByDiscordIdAndPadName('696792849462591649',
     //                       'copperlark-spanish-wordpad'));

       /* let pads = await wordPadDatabase.getWordPadsByDiscordId('696792849462591649');
        console.log(pads);*/

   // await usersDatabase.updateUsername('lobo', '555');

    //await usersDatabase.deleteUser('696792849462591649', new WordPairsDatabase(), new WordPadDatabase());

   // console.log(await usersDatabase.getUserByUsername('copperlark'));

    console.log(await wordPairsDatabase.getWordPairsByPadId(14));
})();