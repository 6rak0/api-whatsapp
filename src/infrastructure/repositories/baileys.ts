import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from "@adiwajshing/baileys";
import { image } from "qr-image";
import MessageExternal from "../../domain/message.external.repository";

class Baileys implements MessageExternal {
    sock: any;
    constructor () {
        this.connect()
    }
    async connect(){
        const { state, saveCreds } = await useMultiFileAuthState(".baileys_auth");
        this.sock = makeWASocket({
          printQRInTerminal: false,
          auth: state,
        });
        this.sock.ev.on("creds.update", saveCreds);
        this.sock.ev.on("connection.update", (update: any) => {
          const { connection, lastDisconnect, qr } = update;
          if (qr) {
            this.generateImage(qr)
          }
          if (connection === "close") {
            const shouldReconnect =
              lastDisconnect.error?.output?.statusCode !==
              DisconnectReason.loggedOut;
            console.log(
              "connection closed due to ",
              lastDisconnect.error,
              ", reconnecting ",
              shouldReconnect
            );
            // reconnect if not logged out
            if (shouldReconnect) {
              this.connect();
            }
            console.log(
              "connection closed due to ",
              lastDisconnect.error,
              ", reconnecting "
            );
          } else if (connection === "open") {
            console.log("opened connection");
          }
        });
        this.sock.ev.on("messages.upsert", ({ messages }:any) => {
          if (messages[0].message.conversation === `online`) {
            console.log("replying to", messages[0].key.remoteJid);
            this.sock.sendMessage(messages[0].key.remoteJid, { text: `online` });
          } else {
            console.log(JSON.stringify(messages, undefined, 2));
          }
        });
    }
  /**
   * Enviar mensaje de WS
   * @param message
   * @returns
   */
  async sendMsg(message: { phone: string; text: string }): Promise<any> {
    try {
      const { phone, text } = message;
      const response = await this.sock.sendMessage(`${phone}@s.whatsapp.net`, {text: text});
      return response;
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  private generateImage = (base64: string) => {
    const path = `${process.cwd()}/temp`;
    let qr_svg = image(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
    console.log(` => scan code in /qr`);
  };
}

export default Baileys;
