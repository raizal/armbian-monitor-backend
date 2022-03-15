import PouchDB from "pouchdb";
import Stb from "../model/stb";
import stbDb, {stbFields} from "../db";

export const getStb = async (id: string): Promise<Stb> => {
    const result = await stbDb.find({
        selector: {_id: id},
        fields: stbFields
    })

    if (result?.docs?.length > 0) {
        return result.docs[0]
    }
    return null
}

export const getStbByFilter = async (filter: Stb): Promise<Stb[]> => {
    const result = await stbDb.find({
        selector: filter,
        fields: stbFields
    })

    if (result?.docs?.length > 0) {
        return result.docs
    }
    return []
}


export const getAllStb = (): Promise<PouchDB.Find.FindResponse<Stb>> => stbDb.find({
    selector: {},
    fields: stbFields,
})

export const deleteStb = async (id: string) => {
    try {
        const doc = await stbDb.get(id);
        await stbDb.remove(doc)
        return true
    } catch (e) {
    }
    return false
}

export const saveStb = (data: Stb) => {
    const _id = data._id || data.hostname//data.mac.join(', ') + '&&' + data.hostname
    getStbByFilter({ ip: data.ip })
        .then(listStb => {
            if (listStb.length > 1) {
                listStb.filter(stb => stb._id != _id).forEach(async (stb) => {
                    await stbDb.remove(await stbDb.get(stb._id))
                })
            }
        })
        .catch((e: any) => {
            console.error(e)
        })
    return stbDb.upsert(_id, (doc) => {
        return {
            ...doc,
            ...data,
            _id
        }
    })
}
