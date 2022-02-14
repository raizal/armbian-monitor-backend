const minerStatistic = (wallet: string) => {
    const url = `https://luckpool.net/verus/miner/${wallet}`
}

const workderStatistic = (wallet: string, workername: string, isHybrid: boolean) => {
    const url = `https://luckpool.net/verus/worker/${wallet}.${workername}${isHybrid ? '-hybrid' : ''}`
}