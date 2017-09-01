const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileSync');
const logger = require('../utils/logger.js');
const adapter = new FileAsync('./model/data/people.json');
const peopleDb = lowdb(adapter);
const util = require('util')


// the methods below need to be tested

class LowDbWrapper {
  constructor(db) {
    this.db = db;
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

  setItemField(itemCategory, searchField, searchValue, assignField, assignValue) {
    return this.getItem(itemCategory, searchField, searchValue)
      .assign({ assignField: assignValue })
      .write();
  }
}

const lowDBPeople = new LowDbWrapper(peopleDb);

module.exports = lowDBPeople;
