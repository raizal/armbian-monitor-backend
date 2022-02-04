import fs from "fs";
import Handlebars from "handlebars";
import Stb from "../model/stb";

const createConfigTemplate = async (data: Stb = {}) => {
  const content = await fs.promises.readFile('./wifi-config.template', 'utf8')
  const template = Handlebars.compile(content)
  const result = template(data)
  const filePath = `./configs/rigs-stb-${data.hostname}`
  await fs.promises.writeFile(filePath, result)
  return filePath
}

export default createConfigTemplate
