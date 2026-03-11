import e from "express";
import redis from "./redis.js";
import { nanoid } from "nanoid";

const port = process.env.APP_PORT || 3000;

const app = new e();
app.use(e.json());

const ttl = 60 * 60 * 24;

// create shortener code
app.post("/", async (req, res) => {
    const body = req.body;
    const url = String(body.url);
    if (url.length < 10 || !url)
        return res.status(401).json({
            message: "minimal url 10",
        });
    const uniqueCode = nanoid(6);
    await redis.setex(uniqueCode, ttl, body.url);
    res.status(201).json({ urlCode: `localhost:3000/${uniqueCode}` });
});

// get all shortener code
app.get('/', async (req, res) => {
    const urlCode = (await redis.keys('*')).filter(value => value != null);
    const keys = [];
    urlCode.forEach((item) => {
        keys.push(item.split(':')[1]);
    });
    res.json({
        message: "succes get all code",
        keys
    });
})

// get value from shortener code
app.get("/:code", async (req, res) => {
    const longUrl = await redis.get(req.params.code);
    if (!longUrl) return res.status(404).json(`url code ${longUrl} Not found`);
    res.redirect(longUrl);
});

// running express
app.listen(port, () => {
    console.log(`running at http://localhost:${port}`);
});
