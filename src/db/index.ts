import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import PouchDBUpsert from 'pouchdb-upsert'

PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBUpsert);

export const stbDb = new PouchDB('stb')
export const settingDb = new PouchDB('setting')
export const logDb = new PouchDB('logs')

export const stbFields = ['hostname', 'name',
  'mac', 'os',
  'netDev', 'temp',
  'hashrate', 'workerName',
  'nodeStatus', 'pm2Status',
  'ccminerStatus', 'skywireStatus',
  'ip', '_id', 'lastUpdate', 'lastRequest', 'cpuLoad', 'ips',
  'minerScript']

export const settingFields = ['_id', 'name', 'value', 'lastUpdate']

export const logFields = ['ip', 'log', 'timestamp']

export default stbDb
