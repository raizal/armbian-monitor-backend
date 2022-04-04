import {saveLog} from "../repository/log";

export default async (ip: string, text: string) => {
    await saveLog(ip, text)
}
