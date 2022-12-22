import { ContainerBuilder } from "node-dependency-injection";
import { MessageCreate } from '../application/message.create'
import MessageCtrl from './controller/message.ctrl';
import WsTransporter from './repositories/ws.external';

const container = new ContainerBuilder();

/**
 * Inicamos servicio de WS / Bot / Twilio
 */
container.register("ws.transporter", WsTransporter);
const wsTransporter = container.get("ws.transporter");

container
  .register("message.creator", MessageCreate)
  .addArgument(wsTransporter);

const messageCreator = container.get("message.creator");

container.register("message.ctrl", MessageCtrl).addArgument(messageCreator);

export default container;