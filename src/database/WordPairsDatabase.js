const Database = require('./Database');
const WordPadDatabase = require('./WordPadDatabase');

class WordPairsDatabase extends Database {
    createQuery = "create table wordpairs (pair_id int primary key " +
        "generated always as identity, " +
        "foreign_word varchar(200), " +
        "translation varchar(200));";
    // alter table wordpairs add column pad_id int;
    // alter table wordpairs add foreign key (pad_id) references wordpad (pad_id)

    tableName = "wordpairs";

    constructor() {
        super();
    }

    async deletePairsByPadId(padId)  {
        try  {
            let query = "DELETE FROM " + this.tableName +
                " WHERE pad_id = $1;";
            const res = await this.query(query, [padId]);
            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async getWordPairsByPadId(padId)  {
        try  {
            let query = "SELECT * FROM " + this.tableName +
                " WHERE pad_id = $1;";
            const res = await this.query(query, [padId]);
            return res.rows.length > 0 ? this.resToPairs(res) : [];
        } catch (e)  {
            console.log(e);
            return [];
        }
    }

    resToPairs(res)  {
        let result = [];

        for (let i = 0; i < res.rows.length; i++) {
            let pair = res.rows[i];

            result.push({
               pairId: pair['pair_id'],
               foreignWord: pair['foreign_word'],
               translation: pair['translation'],
               padId: pair['pad_id']
            });
        }

        return result;
    }

    async createWordPairByIds(padId, foreignWord, translation)  {
        try  {
            let query = "INSERT INTO " + this.tableName +
                " (foreign_word, translation, pad_id) VALUES ($1, $2, $3);"
            const res = await this.query(query, [foreignWord, translation, padId]);
            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async createWordPairByDiscordId(discordUserId,
                                            foreignLang,
                                            translationLang,
                                            foreignWord, translation, discordTag = '')  {
        try  {
            // create pad if needed
            let wordPadDatabase = new WordPadDatabase();
            await wordPadDatabase.createWordPad(discordUserId, foreignLang, translationLang, discordTag);

            // get pad id
            let pad = await wordPadDatabase.getWordPadByDiscordUserIdAndLangs(discordUserId, foreignLang, translationLang);
            let padId = pad.padId;

            return await this.createWordPairByIds(padId, foreignWord, translation);
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async getWordPairsByPadIds(userId, foreignLangId, translationLangId)  {
        try  {
            let wordPadDatabase = new WordPadDatabase();

            let pad = wordPadDatabase.getWordPadByIds(userId, foreignLangId,
                translationLangId);

            let query = "SELECT * FROM " + this.tableName +
                " WHERE  = $2;";
            const result = await this.query(query,
                [this.tableName, userId]);
        } catch (e)  {
            console.log(e);
            return [];
        }
    }
}

module.exports =  WordPairsDatabase;