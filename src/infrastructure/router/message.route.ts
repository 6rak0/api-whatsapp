import { Router } from "express";
import MessageCtrl from "../controller/message.ctrl";
import container from '../container'
const router: Router = Router();

/**
 * http://localhost/message POST
 */
const messageCtrl: MessageCtrl = container.get("message.ctrl");
router.post("/", messageCtrl.sendCtrl);

export { router };