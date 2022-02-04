import fetchStb from "./utils/get-stb.js";

async function checkActive () {
    return new Promise((resolve) => {
        fetchStb('192.168.1',220, 245, 'eth0')
            .then((stb) => resolve(stb))
            .catch(() => resolve([]))
    })
}
checkActive().finally(() => {
    process.exit(0)
})
