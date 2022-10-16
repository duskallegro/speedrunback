const Database = require('./Database');
const LangDatabase = require('./LangDatabase');
const UsersDatabase = require('./UsersDatabase');

class WordPadDatabase extends Database {
    tableName = "wordpad";

    createQuery = "create table wordpad (pad_id int primary key generated always as identity, user_id int, " +
        "foreign key (user_id) references speedusers (user_id), " +
            "foreign_lang_id int, translation_lang_id int, " +
        "foreign key (foreign_lang_id) references langs (lang_id), " +
        "foreign key (translation_lang_id) references langs(lang_id));";

    constructor() {
        super();
    }

    /*async getWordPadCountByIds(userId, foreignLangId, translationLangId)  {

    }*/

    async getPadsByUserId(userId)  {
        try  {
            let query = "SELECT * FROM " + this.tableName +
                " WHERE user_id = $1;";
            const res = await this.query(query, [userId]);
            return this.resToPads(res);
        } catch (e)  {
            console.log(e);
            return [];
        }
    }

    async resToPads(res)  {
        const result = [];

        for (let i = 0; i < res.rows.length; i++) {
            let pad = res.rows[i];
            result.push({
                padId: pad['pad_id'],
                userId: pad['user_id'],
                foreignLangId: pad['foreign_lang_id'],
                translationLangId: pad['translation_lang_id'],
                name: pad['name']
            });
        }

        return result;
    }

    async deletePadsByUserId(userId)  {
        try  {
            let query = "DELETE FROM " + this.tableName +
                " WHERE user_id = $1;";
            const res = await this.query(query, [userId]);
            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async getWordPadsByDiscordId(discordId)  {
        let userDatabase = new UsersDatabase();
        let userId = await userDatabase.getUserIdByDiscordId(discordId);

        return await this.getWordPadsByUserId(userId);
    }

    async getWordPadsByUserId(userId)  {
        try  {
            let query = "SELECT * FROM " + this.tableName +
                    " WHERE (user_id) = ($1)";
            const res = await this.query(query, [userId]);

            const result = [];

            for (let i = 0; i < res.rows.length; i++) {
                let pad = res.rows[i];
                result.push({
                    padId: pad['pad_id'],
                    userId: pad['user_id'],
                    foreignLangId: pad['foreign_lang_id'],
                    translationLangId: pad['translation_lang_id'],
                    name: pad['name']
                });
            }

            return result;
        } catch (e)  {
            console.log(e);
            return [];
        }
    }

    async getWordPadByIds(userId, foreignLangId, translationLangId) {
        try  {
            if (userId !== -1 && foreignLangId !== -1 && translationLangId !== -1)  {
                let query = "SELECT * FROM " + this.tableName +
                    " WHERE (user_id, foreign_lang_id, translation_lang_id) = ($1, $2, $3);";
                const res = await this.query(query, [userId, foreignLangId, translationLangId]);

                if (res.rows.length === 0)  {
                    return null;
                }

                let pad = res.rows[0];
                return {
                    padId: pad['pad_id'],
                    userId: pad['user_id'],
                    foreignLangId: pad['foreign_lang_id'],
                    translationLangId: pad['translation_lang_id']
                };
            } else  {
                return null;
            }
        } catch (e)  {
            console.log(e);
            return null;
        }
    }

    async getWordPadByDiscordUserIdAndLangs(discordUserId, foreignLang, translationLang)  {
        let langDatabase = new LangDatabase();
        let usersDatabase = new UsersDatabase();

        let userId = await usersDatabase.getUserIdByDiscordId(discordUserId);
        let foreignLangId = await langDatabase.getLangIdByName(foreignLang);
        let translationLangId = await langDatabase.getLangIdByName(translationLang);

        return await this.getWordPadByIds(userId, foreignLangId, translationLangId);
    }

    async getWordPadByDiscordIdAndPadName(discordId, padName)  {
        let usersDatabase = new UsersDatabase();

        let userId = await usersDatabase.getUserIdByDiscordId(discordId);
        try  {
            let query = "SELECT * FROM " + this.tableName +
                " WHERE user_id = $1 AND name = $2";
            const res = await this.query(query, [userId, padName]);
            if (res.rows.length <= 0)  {
                return null;
            }

            let foreignLangId = res.rows[0]['foreign_lang_id'];
            let translationLangId = res.rows[0]['translation_lang_id'];

            return await this.getWordPadByIds(userId, foreignLangId, translationLangId);
        } catch (e)  {
            console.log(e);
        }
    }

    async createWordPad(discordUserId, foreignLang, translationLang, discordTag = '')  {
        try {
            // create the lang if needed
            let langDatabase = new LangDatabase();
            await langDatabase.createLang(foreignLang);
            await langDatabase.createLang(translationLang);

            // create the user if needed
            let usersDatabase = new UsersDatabase();
            await usersDatabase.createUser(discordUserId, discordTag);
            await usersDatabase.updateUserByDiscordId(discordUserId, discordTag);

            // get user id, and langs ids

            let userId = await usersDatabase.getUserIdByDiscordId(discordUserId);
            let foreignLangId = await langDatabase.getLangIdByName(foreignLang);
            let translationLangId = await langDatabase.getLangIdByName(translationLang);

            // check if this pad already exists

            let pad = await this.getWordPadByIds(userId, foreignLangId, translationLangId);
            // don't create a duplicate pad
            if (pad !== null)  {
                return false;
            }

            // create word pad
            let query = "INSERT INTO " + this.tableName +
                " (user_id, foreign_lang_id, translation_lang_id)" +
                " VALUES ($1, $2, $3);";
            const res = await this.query(query, [userId, foreignLangId, translationLangId]);

            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
        }
    }
}

module.exports = WordPadDatabase;