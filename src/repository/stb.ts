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
    return stbDb.upsert(_id, (doc) => {
        return {
            ...doc,
            ...data,
            _id
        }
    })
}
