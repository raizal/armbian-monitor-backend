import PouchDB from "pouchdb";
import Setting from "../model/setting";
import stbDb, {settingDb, settingFields} from "../db";
import {set} from "lodash";

export const getConfig = (name: string): Promise<PouchDB.Find.FindResponse<Setting>> => settingDb.find({
    selector: {name: {$eq: name}},
    fields: settingFields
})

export const getAllConfig = (): Promise<PouchDB.Find.FindResponse<Setting>> => settingDb.find({
    selector: {},
    fields: settingFields
})

export const saveConfigs = (settings: Setting[]) => {
    try {
        console.log('SETTINGS VALUE : ', settings)
        settings.forEach(({name, value}) => {
            saveConfig(name, value)
        })
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

export const saveConfig = (name: string, value: string) => {
    settingDb.get<Setting>(name)
        .then((result) => {
            settingDb.put({
                ...result,
                name,
                value,
                lastUpdate: new Date().getTime(),
            })
        })
        .catch(e => {
            console.log(e.status)
            if (e.status === 404) {
                settingDb.put({
                    name,
                    value,
                    lastUpdate: new Date().getTime(),
                    _id: name
                })
            }
        })
}
