export default interface MessageExternal {
    sendMsg({phone, text}:{phone:string, text:string}):Promise<any>
}