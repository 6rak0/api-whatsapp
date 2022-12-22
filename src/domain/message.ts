export class Message {
    readonly phone: string
    readonly text: string

    constructor({phone, text}: {phone:string, text: string}) {
        this.phone = phone
        this.text = text
    }
}