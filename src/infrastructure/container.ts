import { ContainerBuilder } from "node-dependency-injection";
import { MessageCreate } from '../application/message.create'
import MessageCtrl from './controller/message.ctrl';
import WsTransporter from './repositories/ws.external';
import Baileys from './repositories/baileys';

const container = new ContainerBuilder();

/**
 * Inicamos servicio de WS / Bot / Twilio
 */
container.register("ws.transporter", WsTransporter);
const wsTransporter = container.get("ws.transporter");

container.register("baileys", Baileys);
const baileys = container.get("baileys");

container
  .register("message.creator", MessageCreate)
  .addArgument(baileys);

const messageCreator = container.get("message.creator");

container.register("message.ctrl", MessageCtrl).addArgument(messageCreator);

export default container;