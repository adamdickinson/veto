import fs from 'fs'
import http from 'http'

export const download = (url: string, destination: string) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination)
    http.get(url, (response) => {
      response.pipe(file)
      file
        .on('finish', () => {
          file.close()
          resolve()
        })
        .on('error', (error) => {
          console.error(error);
          fs.unlink(destination, () => {
            reject(error.message)
          })
        })
    })
  })
