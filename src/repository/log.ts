import PouchDB from "pouchdb";
import Stb from "../model/stb";
import { logDb ,logFields} from "../db";
import Log from "../model/log";

export const getLog = (ip: string): Promise<PouchDB.Find.FindResponse<Log>> => logDb.find({
    selector: { ip },
    fields: logFields
})

export const saveLog = (ip: string, log: string) => {
    return logDb.post({
        ip,
        log,
        timestamp: new Date().getTime()
    })
}
