import PouchDB from "pouchdb";
import Stb from "../model/stb";
import stbDb, {stbFields} from "../db";

export const getAllStb = (): Promise<PouchDB.Find.FindResponse<Stb>> => stbDb.find({
    selector: {},
    fields: stbFields,
})