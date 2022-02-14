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

export const saveStb = (data: Stb) => {
    stbDb.get(data.name)
        .then(result => {
            stbDb.put({
                ...result,
                ...data
            }, { force: true })
        })
        .catch(e => {
            if (e.status === 404) {
                stbDb.put({
                    ...data,
                    _id: data.name
                })
            }
        })
}