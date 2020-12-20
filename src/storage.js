
class Storage {
  constructor(storeDataType = 'content') {
    this.store = chrome.storage ? chrome.storage.local : {}
    this.storeDataType = ['content', 'tags', 'facorites'].includes(storeDataType) ? storeDataType : null
    if (!this.storeDataType) {
      console.warn('not allow store this type data')
    } else {
      this.prefix = `storage_data_${this.storeDataType}`
    }
    this.isContentData = this.storeDataType === 'content' 
  }
  addUniquePrefix(keys) {
    if (!this.storeDataType) return keys
    return keys.map(k => `${this.prefix}_${k}`)
  }
  removeUniquePrefix(itemObj) {
    let result = {}
    Object.entries(itemObj).reduce((res, cur) => {
      const [k, v] = cur;
      let removePrefixKey = k.split(`${this.prefix}_`)
      removePrefixKey.shift()
      res[removePrefixKey.join('')] = v
      return res
    }, result)
    return result
  }
  get(keys) {
    return new Promise(resolve => {
      if (this.isContentData) {
        keys = this.addUniquePrefix(keys)
          this.store.get(keys, (values) => {
            resolve(Array.isArray(values) ? values.map(this.removeUniquePrefix) : this.removeUniquePrefix(values))
          })
      } else {
        this.store.get([this.prefix], values => {
          resolve(values[this.prefix])
        })
      }
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
      return storeData[this.prefix] || []
    }
  }
  // { tags: ['fsfdsfsf'] }
  async set(updateObj) {
    if (this.storeDataType === 'content') {
      for (let k in updateObj) {
        updateObj[this.addUniquePrefix([k])[0]] = updateObj[k]
        delete updateObj[k]
      }
      return this.store.set(updateObj)
    } else {
      let storeItem = {}
      storeItem[this.prefix] = updateObj
      await this.store.set(storeItem)
    }
  }
  async setContentValue(title, resetObj) {
    const getObj = await this.get([title]) || {}
    console.log('getObj', getObj)
    console.log('objTitle', getObj[title], resetObj)
    const originValue = (getObj[title]) || {}
    const setItem = {}
    setItem[title] = Object.assign({}, originValue, resetObj)
    console.log('or', originValue, resetObj)
    await this.set(setItem)
    console.log('getget', await this.get([title]))
  }
  async addFavor(favorItem) {
    if (this.storeDataType !== 'facorites') return;
    let allFavorites = await this.get() || []
    allFavorites.unshift(favorItem)
    await this.set(allFavorites)
  }
  async removeFavor(favorName) {
    let allFavorites = await this.get() || []
    if (!allFavorites.length) return
    const removeFavorIndex = allFavorites.findIndex(favor => favor.name === favorName)
    allFavorites.splice(removeFavorIndex, 1)
    await this.set(allFavorites)
    return allFavorites
  }
  async addTag(tagName) {
    if (this.storeDataType !== 'tags') return;
    let allTags = await this.get() || []
    allTags.unshift({ text: tagName })
    await this.set(allTags)
  }
  async removeTag(tagName) {
    let tagList = await this.get() || []
    if (!tagList.length) return
    const removeTagIndex = tagList.findIndex(tag => tag.text === tagName)
    tagList.splice(removeTagIndex, 1)
    await this.set(tagList)
    return tagList
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