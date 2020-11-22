
class Storage {
  constructor(storeDataType = 'content') {
    this.store = chrome.storage ? chrome.storage.local : {}
    this.storeDataType = ['content', 'tags', 'facorites'].includes(storeDataType) ? storeDataType : null
    if (!this.storeDataType) {
      console.warn('not allow store this type data')
    } else {
      this.prefix = `storage_data_${this.storeDataType}`
    }
  }
  addUniquePrefix(keys) {
    if (!this.storeDataType) return keys
    console.log('keyskeys', keys)
    return keys.map(k => `${this.prefix}_${k}`)
  }
  get(keys) {
    return new Promise(resolve => {
      keys = this.addUniquePrefix(keys)
      this.store.get(keys, resolve)
    })
  }
  getAllList() {
    return new Promise(resolve => {
      this.store.get(null, resolve)
    })
  }
  async getList() {
    const storeData = await this.getAllList()
    if (this.storeDataType === 'content') {
      let list = {}
      Object.entries(storeData).filter(([key, val]) => {
        console.log('v', val)
        return key.startsWith(this.prefix)
      }).reduce((res, cur) => {
        const splitKeys = cur[0].split(`${this.prefix}_`)
        splitKeys.shift()
        res[splitKeys.join('')] = cur[1]
        return res
      }, list)
      return list
    } else {
      return storeData[this.prefix]
    }
  }
  // { tags: ['fsfdsfsf'] }
  set(updateObj) {
    if (this.storeDataType === 'content') {
      for (let k in updateObj) {
        console.log('keykey', k)
        updateObj[this.addUniquePrefix([k])[0]] = updateObj[k]
        delete updateObj[k]
      }
      return this.store.set(updateObj)
    } else {
      let storeItem = {}
      storeItem[this.prefix] = updateObj
      this.store.set(storeItem)
    }
  }
  clear() {
    return new Promise(resolve => {
      this.store.clear(resolve)
    })
  }
  remove(keys) {
    return new Promise(resolve => {
      keys = this.addUniquePrefix(keys)
      this.store.remove(keys, resolve)
    })
  }
}

export default Storage