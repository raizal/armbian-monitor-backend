export enum InstallationStatus {
    NOT_INSTALLED = 'NOT INSTALLED',
    INSTALLED = 'INSTALLED',
    NOT_RUNNING = 'NOT RUNNING',
    RUNNING = 'RUNNING'
}

export default interface Stb {
    _id?: string | null,
    ip?: string | null,
    hostname?: string | null,
    name?:  string | null,
    mac?:  Array<string> | null,
    os?: string| null,
    netDev?: Array<string>,
    temp?: number | 0,
    hashrate?: string | 'n/a',
    diff?: string | 'n/a',
    shares?: string | 'n/a',
    workerName?: string | 'n/a',
    nodeStatus?: InstallationStatus | InstallationStatus.NOT_INSTALLED,
    pm2Status?: InstallationStatus | InstallationStatus.NOT_INSTALLED,
    ccminerStatus?: InstallationStatus | InstallationStatus.NOT_INSTALLED,
    skywireStatus?: InstallationStatus | InstallationStatus.NOT_INSTALLED,
    lastUpdate?: number
}
