const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const logger = require('../utils/logger.js');
const util = require('util');

class LowDbWrapper {
  constructor(fileName) {
    const adapter = new FileSync(fileName);
    this.db = lowdb(adapter);
  }

  /**
   * Init the storage with an object
   * @param {Object} defaultValue 
   */
  init(defaultValue) {
    return this.db.defaults(defaultValue)
      .write();
  }

  addItem(itemCategory, itemValue) {
    return this.db.get(itemCategory)
      .push(itemValue)
      .write();
  }

  getItem(itemCategory, searchField, searchValue) {
    const searchedObj = {};
    searchedObj[searchField] = searchValue;
    return this.db.get(itemCategory)
      .find(searchedObj)
      .value();
  }

  // for a specific item
  setItemField(itemCategory, searchField, searchValue, assignField, assignValue) {
    const searchedObj = {};
    searchedObj[searchField] = searchValue;
    const assignedObj = {};
    assignedObj[assignField] = assignValue;
    return this.db.get(itemCategory)
      .find(searchedObj)
      .assign(assignedObj)
      .write();
  }

  // for all items of a given category
  setAllItemsField(itemCategory, assignField, assignValue) {
    const assignedObj = {};
    assignedObj[assignField] = assignValue;
    // logger.debug(this.db.get(itemCategory)
    return this.db.get(itemCategory)
      .forEach((item) => {
        item[assignField] = assignValue;
      })
      .write();
  }

  deleteItem(itemCategory, searchField, searchValue) {
    const searchedObj = {};
    searchedObj[searchField] = searchValue;
    return this.db.get(itemCategory)
      .remove(searchedObj)
      .write();
  }
}

module.exports = LowDbWrapper;
