const express = require("express");
const { Client } = require("whatsapp-web.js");
// const qrcode = require("qrcode-terminal");
const { image } = require("qr-image");
const cors = require("cors");

const generateImage = (base64) => {
    const path = `${process.cwd()}/temp`;
    let qr_svg = image(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
    console.log(`qr creado en ${path}`);
};

const sendMsg = async (phone, message) => {
    try {
        const response = await client.sendMessage(`${phone}@c.us`, message);
        return response;
    } catch (error) {
        return error;
    }
};

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client();
client.on("qr", (qr) => {
    //qrcode.generate(qr, { small: true });
    generateImage(qr);
});
client.on("ready", () => {
    console.log("Client is ready!");
});
client.on("message", (msg) => {
    if (msg.body == "!up") {
        msg.reply("sí, estoy activo");
    }
});
client.initialize();

// app.post("/post", (req, res) => {
//     console.log(req.body);
//     const { phone, message } = req.body;
//     console.log(phone, message);
//     res.json({
//         status: "ok",
//     });
// });

// app.get('/get', (res) => {
//     res.json([0,1,2,3,4,5,666])
// })

app.post("/send-whatsapp", (req, res, next) => {
    const { phone, message } = req.body;
    res.json(sendMsg(phone, message));
});

app.listen(3006, () => {
    console.log("Server running on port 3006");
});
