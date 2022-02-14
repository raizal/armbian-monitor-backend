import {io} from "../index";

const emitLog = (id: string, action: string, message: string, done: boolean = false) => {
    emit(action, {
        id,
        status: message,
        done
    })
    console.log(id, action, message)
}

export const emit = (action: string, payload: any) => {
    io.sockets.emit('web-client-receive', {
        action,
        result: payload
    })
}

export default emitLog
