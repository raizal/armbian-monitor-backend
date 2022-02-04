async function index () {
    // return new Promise(async (resolve) => {
    //
    //     const profileID = 'wifi-home'
    //
    //     const { prefix, start, end } = getArgs()
    //
    //     const result = await fetchStb(prefix,start, end, 'wlan0')
    //     const stb = result
    //         .filter(data => data.netDev.indexOf('wlan0   wifi      connected') >= 0)
    //         .sort((a, b) => parseInt(a.hostname) - parseInt(b.hostname))
    //
    //     console.log(stb)
    //
    //     const promises = []
    //
    //     for (const item of stb) {
    //         promises.push(new Promise(async resolve => {
    //             try {
    //                 const {ip} = item
    //                 const ssh = await connect(ip)
    //                 const path = await createConfigTemplate({
    //                     ...item, profileID
    //                 })
    //
    //                 await deleteOldWifiConfigs(ssh)
    //                 await ssh.putFile(path, `/etc/NetworkManager/system-connections/${profileID}`)
    //                 await run(ssh, `chmod 600 /etc/NetworkManager/system-connections/${profileID}`)
    //                 await run(ssh, 'nmcli con up wifi-home')
    //                 ssh.dispose()
    //             } catch (e) {
    //                 console.error(e)
    //             }
    //             resolve()
    //         }))
    //         if (promises.length === 15) {
    //             await Promise.all(promises)
    //             promises.splice(0, promises.length)
    //         }
    //     }
    //     await Promise.all(promises)
    //
    //     resolve()
    // })
}

index().finally(() => {
    process.exit(0)
})
