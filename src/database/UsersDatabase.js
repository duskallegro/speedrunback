const Database = require("./Database");
// const WordPairsDatabase = require('./WordPairsDatabase');
// const WordPadDatabase = require('./WordPadDatabase');

class UsersDatabase extends Database  {
    tableName = "speedusers";
    createQuery = `create table if not exists ` + this.tableName + ` 
        (user_id integer primary key generated always as identity, 
        discord_id varchar(200) unique not null, email varchar(200) unique);`;
    // added discord_tag column later
    constructor() {
        super();
    }

    async getUserByUsername(username)  {
        try  {
            let query = "SELECT * FROM " + this.tableName +
                " WHERE username = $1;";
            const res = await this.query(query, [username]);
            return res.rows.length > 0 ? this.smallResToUser(res.rows[0]) : null;
        } catch (e)  {
            console.log(e);
            return null;
        }
    }

    async getUserByDiscordId(discordId)  {
        try  {
            let query = "SELECT * FROM " + this.tableName +
                " WHERE discord_id = $1;";
            const res = await this.query(query, [discordId]);
            return res.rows.length > 0 ? this.smallResToUser(res.rows[0]) : null;
        } catch (e)  {
            console.log(e);
            return null;
        }
    }

    async smallResToUser(smallRes)  {
        return {
          username: smallRes.username,
          discordId: smallRes['discord_id'],
          email: smallRes.email,
          discordTag: smallRes['discord_tag'],
          userId: smallRes['user_id']
        };
    }

    async deleteUser(discordId, pairsDatabase, padsDatabase)  {
        try  {
            let userId = await this.getUserIdByDiscordId(discordId);

            // let pairsDatabase = new WordPairsDatabase();
            // let padsDatabase = new WordPadDatabase();

            let pads = await padsDatabase.getPadsByUserId(userId);

            for (let i = 0; i < pads.length; i++) {
                let pad = pads[i];
                await pairsDatabase.deletePairsByPadId(pad.padId);
            }
            await padsDatabase.deletePadsByUserId(userId);

            let query = "DELETE FROM " + this.tableName +
                " WHERE user_id = $1;";
            const res = await this.query(query, [userId]);
            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async createUser(discordId, discordTag = '')  {
        try  {
            let query = "INSERT INTO speedusers (discord_id, discord_tag) VALUES ($1, $2);";
            const res = await this.query(query, [discordId, discordTag]);

            await this.updateUsername(discordTag.substring(0, discordTag.indexOf("#")), discordId);

            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async updateUsername(username, discordId)  {
        try  {
            let query = "UPDATE " + this.tableName +
                " SET username = $1 WHERE discord_id = $2;";
            const res = await this.query(query, [username, discordId]);

            return res.rows.length > 0;
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async updateUserByDiscordId(discordId, discordTag)  {
        try  {
            let query = "SELECT user_id FROM " + this.tableName +
                " WHERE discord_id = $1;";
            let res = await this.query(query, [discordId]);
            if (res.rows.length > 0 && discordTag !== '')  {
                query = "UPDATE " + this.tableName +
                    " SET discord_tag = $1 WHERE discord_id = $2;";
                res = await this.query(query, [discordTag, discordId]);
                return res.rows.length > 0;
            } else  {
                return false;
            }
        } catch (e)  {
            console.log(e);
            return false;
        }
    }

    async getUserIdByDiscordId(discordId)  {
        try  {
            let query = "SELECT user_id FROM " + this.tableName +
                " WHERE discord_id = $1;";
            const res = await this.query(query, [discordId]);
            return res.rows.length > 0 ? res.rows[0]['user_id'] : -1;
        } catch (e)  {
            console.log(e);
            return -1;
        }
    }

    async getAllUsers()  {
        let query = "SELECT * FROM " + this.tableName + ";";
        const result = await this.query(query, []);

        let users = [];

        for (const user of result.rows)  {
            users.push({
               id: user['user_id'],
               discordId: user['discord_id'],
               discordTag: user['discord_tag']
            });
        }

        return users;
    }

    setupUsersDatabase()  {

    }
}

module.exports = UsersDatabase;