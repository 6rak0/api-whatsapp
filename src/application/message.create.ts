import MessageExternal from '../domain/message.external.repository'

export class MessageCreate {
    private messageExternal: MessageExternal
    constructor(repositories: MessageExternal){
        const messageExternal = repositories
        this.messageExternal = messageExternal
    }

    public async sendMsg({phone, text}:{phone:string, text:string}){
        const responseExSave = await this.messageExternal.sendMsg({phone, text})
        return responseExSave
    }
}