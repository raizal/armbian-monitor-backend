interface Args {
  prefix: string
  start: string
  end: string
}

const getArgs = (): Args => {
  let prefix: string = "0"
  let start: string = "1"
  let end: string = "254"
  process.argv.slice(2).forEach(arg => {
    const variable = arg.split('=')
    switch (variable[0]) {
      case "prefix":
        prefix = variable[1]
        break
      case 's':
        start = variable[1]
        break
      case 'e':
        end = variable[1]
        break
    }
  })
  return {
    prefix, start, end
  }
}

export default getArgs
