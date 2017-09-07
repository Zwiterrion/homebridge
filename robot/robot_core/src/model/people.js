
const ITEM_CATEGORY = 'people';

class PeopleModel {
  constructor(peopleDb) {
    this.peopleDb = peopleDb;
    this.peopleDb.init({ people: [] });
  }

  addPerson(id, firstName, lastName, favoriteColor = 'red', alreadySeen = true) {
    const item = {
      id,
      firstName,
      lastName,
      favoriteColor,
      alreadySeen
    };
    return this.peopleDb.addItem(ITEM_CATEGORY, item);
  }

  getPerson(id) {
    return (this.peopleDb.getItem(ITEM_CATEGORY, 'id', id));
  }

  checkPersonAsSeen(id) {
    return this.peopleDb.setItemField(ITEM_CATEGORY, 'id', id, 'alreadySeen', true);
  }

  uncheckPersonSeen(id) {
    return this.peopleDb.setItemField(ITEM_CATEGORY, 'id', id, 'alreadySeen', false);
  }

  uncheckAllPersonSeen() {
    return this.peopleDb.setAllItemsField(ITEM_CATEGORY, 'alreadySeen', false);
  }

  isPersonSeen(id) {
    return (this.peopleDb.getItem(ITEM_CATEGORY, 'id', id)).alreadySeen;
  }

  isPersonRegister(id) {
    return (!!this.peopleDb.getItem(ITEM_CATEGORY, 'id', id));
  }

  getFavoriteColor(id) {
    return (this.peopleDb.getItem(ITEM_CATEGORY, 'id', id)).favoriteColor;
  }

  deletePerson(id) {
    return this.peopleDb.deleteItem(ITEM_CATEGORY, 'id', id);
  }
}

module.exports = PeopleModel;
