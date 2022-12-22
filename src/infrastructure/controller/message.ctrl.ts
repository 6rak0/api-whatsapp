import { Request, Response } from "express";
import { MessageCreate } from "../../application/message.create";

class MessageCtrl {
  constructor(private readonly MessageCreator: MessageCreate) {}

  public sendCtrl = async ({ body }: Request, res: Response) => {
    const { phone, text } = body;
    const response = await this.MessageCreator.sendMsg({ phone, text })
    res.send(response);
  };
}

export default MessageCtrl;