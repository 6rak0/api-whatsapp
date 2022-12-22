import { Client, LocalAuth } from "whatsapp-web.js";
import { image } from "qr-image";
import qrcode from 'qrcode-terminal'
import MessageExternal from "../../domain/message.external.repository";

class WsTransporter extends Client implements MessageExternal {
  private status = false;

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
    },
    });

    console.log(`➡️ setting up ...`);

    this.initialize();

    this.on("ready", () => {
      this.status = true;
      console.log(`✅ endpoint ready`);
    });

    this.on("auth_failure", () => {
      this.status = false;
      console.log(`❌ auth failure`);
    });

    this.on("qr", (qr) => {
      this.qrterminal(qr)
      //this.generateImage(qr)
    });
  }

  /**
   * Enviar mensaje de WS
   * @param message
   * @returns
   */
  async sendMsg(message: { phone:string, text:string }): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
      const { phone, text } = message;
      const response = await this.sendMessage(`${phone}@c.us`, text);
      return response;
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  getStatus(): boolean {
    return this.status;
  }

  private generateImage = (base64:string) => {
    const path = `${process.cwd()}/temp`;
    let qr_svg = image(base64, { type: "svg", margin: 4 });
    qr_svg.pipe(require("fs").createWriteStream(`${path}/qr.svg`));
    console.log(` => scan code in /qr`);
  };
  private qrterminal = (base64:string) => {
    qrcode.generate(base64, { small: true });
  }
}

export default WsTransporter;