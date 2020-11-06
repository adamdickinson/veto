import { createStore } from 'store/src/store-engine'
import get from 'lodash/get'
import set from 'lodash/set'
import unset from 'lodash/unset'

import fs from 'fs'

import { DataNode, DataPoint } from '../types/fileStore'

const createFileStore = (filePath = 'data.json') => {
  const getData = (): Record<string, DataNode> =>
    fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : {}

  let data = getData()

  const read = (key: string) => get(getData(), key)

  const write = <Value>(key: string, value: Value) => {
    set(data, key, value)
    fs.writeFileSync(filePath, JSON.stringify(data))
  }

  const each = (callback: (value: DataNode, key: string) => DataPoint) =>
    Object.entries(getData()).map(([key, value]) => callback(value, key))

  const remove = (key: string) => {
    const data = getData()
    unset(data, key)
    fs.writeFileSync(filePath, JSON.stringify(data))
  }

  const clearAll = () => fs.writeFileSync(filePath, '{}')

  return {
    name: 'filestore',
    read,
    write,
    each,
    remove,
    clearAll,
  }
}

export default (filePath?: string) => createStore([createFileStore(filePath)], [])
