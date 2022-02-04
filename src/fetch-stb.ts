import fetchStb from "./utils/get-stb.js";
import getArgs from "./utils/get-args.js";
import {parseInt} from "lodash";

const index = () => {
    return new Promise<void>((resolve) => {
        const {
            prefix,
            start,
            end
        } = getArgs()
        fetchStb(prefix, parseInt(start), parseInt(end), 'eth0')
            .then((result) => {
                const stb = result.filter(data => data.netDev.indexOf('wlan0   wifi      connected') >= 0)
                console.log(stb.sort((a, b) => parseInt(a.hostname) - parseInt(b.hostname)))
                console.log(stb.length, ' connected')
            })
            .finally(() => {
                resolve()
            })
    })
}

index().finally(() => {
    process.exit(0)
})
