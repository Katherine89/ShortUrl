
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { getSqlUtcDateTime } from '../utilities/sql-date.js';

export default class UrlDbContext {
    #db = null;

    async init() {
        this.#db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });

        // Create New Database And Table If Not Exists
        const query = await this.#db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='short_urls'");
        if (!query) {
            await this.#db.exec('CREATE TABLE `short_urls` ( `url` VARCHAR(5) NOT NULL, `full_url` VARCHAR(2048) NOT NULL, `created_at` DATETIME	NOT NULL, PRIMARY KEY(`url`));');
        }
    }

    async getUrlCount() {
        const query = await this.#db.get(`SELECT COUNT(url) AS \`count\` FROM \`short_urls\`;`);
        return query ? query['count'] : null;
    }

    async getUrlLatest(count) {
        return await this.#db.all(`SELECT * FROM \`short_urls\` ORDER BY \`created_at\` DESC LIMIT ${count};`);
    }

    async getUrlLastOne() {
        const query = await this.#db.get(`SELECT \`url\` FROM \`short_urls\` ORDER BY \`created_at\` ASC LIMIT 1;`);
        return query ? query['url'] : null;
    }

    async getFullUrl(url) {
        const query = await this.#db.get(`SELECT \`full_url\` FROM short_urls WHERE \`url\` = '${url}';`);
        return query ? query['full_url'] : null;
    }

    async setUrl(url, fullUrl) {
        const utcDatetime = getSqlUtcDateTime();
        await this.#db.exec(`INSERT INTO \`short_urls\` (\`url\`, \`full_url\`, \`created_at\`) VALUES('${url}', '${fullUrl}', '${utcDatetime}');`);
    }

    async deleteUrl(url) {
        await this.#db.exec(`DELETE FROM \`short_urls\` WHERE \`url\` = '${url}';`);
    }
}