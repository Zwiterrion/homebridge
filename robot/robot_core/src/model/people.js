const lowDBPeople = require('./lowdbImpl');

class PeopleModel {
  constructor(peopleDb) {
    this.peopleDb = peopleDb;
    this.peopleDb.init({ people: [] });
  }

  addPerson(id, firstName, lastName, favoriteColor) {
    const item = {
      id,
      firstName,
      lastName,
      favoriteColor
    };
    return this.peopleDb.addItem('people', item);
  }

  // updatePerson(id, ) {

  // }

  // deletePerson() {

  // }

  // isRegister() {

  // }

  // getFavoriteColor() {

  // }
}

module.exports = new PeopleModel(lowDBPeople);
