const EXAMPLE_WORKER = {
    "timestamp": 1644018170,
    "worker": "RNZDrcf97tBDwWtCURFpBbexPaCR5evyuu.all-for-one-hybrid",
    "hashrateSols": 42834815.99,
    "hashrateString": "42.83 MH",
    "avgHashrateSols": 37771924.1,
    "avgHashrateSols24HR": 0,
    "estimatedLuck": "17.73 Days",
    "shares": 1194612.1425,
    "efficiency": 100,
    "currDiff": 20587,
    "peakDiff": 21427,
    "avgShareTime": 4.39,
    "stratumServer": "ap",
    "software": "hellminer/0.52-Windows",
    "hybridsolo": true,
    "xnsub": 1,
    "nonce": "d6f6b14b"
}

export interface WorkerStatistic {
    timestamp?: number,
    worker?: string,
    hashrateSols?: number,
    hashrateString?: string,
    avgHashrateSols?: number,
    avgHashrateSols24HR?: number,
    estimatedLuck?: string,
    shares?: number,
    efficiency?: number,
    currDiff?: number,
    peakDiff?: number,
    avgShareTime?: number,
    stratumServer?: string,
    software?: string,
    hybridsolo?: boolean,
    xnsub?: number,
    nonce?: string
}