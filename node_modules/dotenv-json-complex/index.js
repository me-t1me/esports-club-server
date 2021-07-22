const { readFileSync } = require("fs")
const { resolve } = require("path")

const getFileName = environment => {
  let filename = '.env.json'

  if (environment) {
    filename = `.env.${environment}.json`
  }

  return filename
}

const getDirPath = directory => {
  let dirPath = process.cwd()

  if (directory) {
    dirPath = resolve(dirPath, directory)
  }

  return dirPath
}

const getPath = (dirpath, filename, path) => {
  if (!path) {
    path = resolve(dirpath, filename)
  }

  return path
}

module.exports = ({ directory, environment, encoding = 'utf8', path } = {}) => {
  let
    dirpath = getDirPath(directory),
    filename = getFileName(environment)

  path = getPath(dirpath, filename, path)

  try {
    const parsed = JSON.parse(readFileSync(path, { encoding }))

    const { env } = process
    for (const key in parsed) {
      if (!env.hasOwnProperty(key)) {
        const value = parsed[key]

        env[key] = typeof value === 'string' ? value : JSON.stringify(value)
      }
    }

    return { parsed }
  } catch (error) {
    return error
  }
}