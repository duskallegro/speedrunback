const Database = require('./Database');

class LangDatabase extends Database {
    createQuery = "create table langs (lang_id integer primary key " +
        "generated always as identity, " +
        "lang varchar(200) unique not null);";
    tableName = "langs";

    constructor() {
        super();
    }

    async getLangIdByName(lang)  {
        try  {
            let query = "SELECT lang_id FROM " + this.tableName +
                " WHERE lang = $1;";
            const res = await this.query(query, [lang]);
            return res.rows.length > 0 ? res.rows[0]['lang_id'] : -1;
        } catch (e)  {
            console.log(e);
            return -1;
        }
    }

    async createLang(lang)  {
        try  {
            let query = "INSERT INTO " + this.tableName +
                " (lang) VALUES ($1) RETURNING lang_id;";
            let res = await this.query(query, [lang]);

            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async getAllLangs()  {
        try  {
            let query = "SELECT * FROM " + this.tableName;
            const result = await this.query(query,
                []);

            let languages = [];

            for (const lang of result.rows)  {
                languages.push(lang.lang);
            }

            return languages;
        } catch (e)  {
            console.log(e);
            return [];
        }
    }
}

module.exports = LangDatabase;