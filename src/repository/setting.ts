import PouchDB from "pouchdb";
import Setting from "../model/setting";
import {settingDb, settingFields} from "../db";

export const getConfig = async (name: string): Promise<Setting> => {
    const result = await settingDb.find({
        selector: {name: name},
        fields: settingFields
    })

    if (result?.docs?.length > 0) {
        return result.docs[0]
    }
    return null
}

export const getConfigValue = async (name: string, defaultValue: string = ''): Promise<string> => {
    const result: PouchDB.Find.FindResponse<Setting> = await settingDb.find({
        selector: {name: name},
        fields: settingFields
    })

    if (result?.docs?.length > 0) {
        const data: Setting = result.docs[0]
        return data.value || defaultValue
    }
    return defaultValue
}

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

export const saveConfig = async (name: string, value: string) => {
    return new Promise<void>(resolve => {
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
            .finally(() => {
                resolve()
            })
    })
}
