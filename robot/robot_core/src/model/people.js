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

  isRegister(id) {
    return (!!this.peopleDb.getItem('people', 'id', id));
  }

  getFavoriteColor(id) {
    return (this.peopleDb.getItem('people', 'id', id)).favoriteColor;
  }
}

module.exports = new PeopleModel(lowDBPeople);
