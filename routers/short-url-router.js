import express from 'express';
import UrlDbContext from '../repositories/url-db-context.js';
import UniqueNumStrMap from '../utilities/unique-num-str-map.js';

export const ShortUrlRouter = express.Router();

const MAX_URL_COUNT = 100;
const FIXED_URL_LENGTH = 5;

const uniqueMap = new UniqueNumStrMap(FIXED_URL_LENGTH);
const dbContext = new UrlDbContext();
await dbContext.init();

//#region API
ShortUrlRouter.get('/urls', async (req, res) => {
    const query = await dbContext.getUrlLatest(20);
    res.send(query);
});

ShortUrlRouter.get('/:url', async (req, res) => {
    const url = req.params.url;
    let errorCode = 400;

    if (isValidStr(url)) {
        const fullUrl = await dbContext.getFullUrl(url);
        if (fullUrl) {
            res.redirect(fullUrl);
            return;
        }
        errorCode = 404;
    }
    res.status(errorCode).end();
});

ShortUrlRouter.post('/gen', async (req, res) => {
    try {
        const fullUrl = req.body['full_url'];
        if (!(isValidStr(fullUrl) && isValidUrl(fullUrl))) throw new Error('Invalid URL !');

        const url = await getUniqueUrl();
        await dbContext.setUrl(url, fullUrl);
        res.send({ "url": url });

        await tryDeleteInvalidUrls();
        console.log(url, fullUrl, await dbContext.getUrlCount());
    }
    catch (err) {
        res.status(400).end(err);
    }
});
//#endregion

//#region Methods
async function getUniqueUrl() {
    let [n, url] = uniqueMap.getByRandom();
    let fullUrl = await dbContext.getFullUrl(url);

    while (fullUrl) {
        n = (n + 1) % uniqueMap.max;
        [n, url] = uniqueMap.getByNum(n);
        fullUrl = await dbContext.getFullUrl(url);
    }
    return url;
}

async function tryDeleteInvalidUrls() {
    const count = async () => await dbContext.getUrlCount();

    while (await count() > MAX_URL_COUNT) {
        const lastUrl = await dbContext.getUrlLast();
        await dbContext.deleteUrl(lastUrl);
    }
}

function isValidStr(str) {
    return str && !str.includes('<') && !str.includes('>') && !str.includes(' ');
}

function isValidUrl(url) {
    return url && (url.includes('http://') || url.includes('https://')) && url.length > 10;
}
//#endregion