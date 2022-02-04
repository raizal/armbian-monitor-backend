import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'

PouchDB.plugin(PouchDBFind);

export const stbDb = new PouchDB('stb')
export const settingDb = new PouchDB('setting')

export const stbFields = ['hostname', 'name',
  'mac', 'os',
  'netDev', 'temp',
  'hashrate', 'workerName',
  'nodeStatus', 'pm2Status',
  'ccminerStatus', 'skywireStatus',
  'ip', '_id',]

export const settingFields = ['_id', 'name', 'value', 'lastUpdate']

export default stbDb
