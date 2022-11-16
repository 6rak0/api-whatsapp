const fs = require("fs");
const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
//const qrcode = require("qrcode-terminal");
const { image } = require("qr-image");
const cors = require("cors");
const port = 3006;

const generateImage = (base64) => {
    const path = `${process.cwd()}/temp`;
    let qr_svg = image(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
    console.log(` => scan code in /qr`);
};

const sendMsg = async (phone, message) => {
    try {
        await client.sendMessage(`${phone}@c.us`, message);
        return {
            message: "ok",
            status: 200,
        };
    } catch (error) {
        return {
            message: "fail",
            status: 400,
            error,
        };
    }
};

const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one",
    }),
    puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
    },
});
client.on("qr", (qr) => {
    //qrcode.generate(qr, { small: true });
    generateImage(qr);
});
client.on("authenticated", () => {
    console.log(" => authenticated succesfully");
});
client.on("ready", () => {
    console.log(" => /wa endpoint is ready!");
});
client.on("message", (msg) => {
    if (msg.body == "!online") {
        msg.reply("all services online");
    }
});
client.initialize();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/qr", (req, res) => {
    res.writeHead(200, { "content-type": "image/svg+xml" });
    fs.createReadStream(`${__dirname}/temp/qr.svg`).pipe(res);
});

app.post("/wa", async (req, res) => {
    const { phone, message } = req.body;
    res.json(await sendMsg(phone, message));
});

app.listen(port, () => {
    console.log(` => server running on port ${port}`);
});
