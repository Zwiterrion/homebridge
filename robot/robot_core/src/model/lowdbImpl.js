const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileSync');

const adapter = new FileAsync('./model/data/people.json');
const peopleDb = lowdb(adapter);

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
    return this.db.get(itemCategory)
      .find({ searchField: searchValue })
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
