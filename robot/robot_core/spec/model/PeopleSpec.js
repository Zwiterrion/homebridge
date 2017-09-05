describe('People', () => {

  // instantiation
  const LowDbWrapper = require('../../src/model/lowdbImpl');
  const PeopleModel = require('../../src/model/people');
  const FILE_PATH = './spec/model/peopleTest.json';
  const peopleLowDb = new LowDbWrapper(FILE_PATH);
  const peopleDb = new PeopleModel(peopleLowDb);

  const aPerson = {
    id: 'jean',
    firstName: 'Jean',
    lastName: 'Dupont',
    favoriteColor: 'vert',
    alreadySeen: false,
  };

  const anotherPerson = {
    id: 'arnaud',
    firstName: 'Arnaud',
    lastName: 'Dupond',
    favoriteColor: 'bleu',
    alreadySeen: false,
  };

  const anSWPerson = {
    id: 'seen',
    firstName: 'Luke',
    lastName: 'Skywalker',
    favoriteColor: 'vert',
    alreadySeen: false,
  };

  it('should be possible to add a person and retrieve it', () => {
    peopleDb.addPerson(aPerson.id, aPerson.firstName,
      aPerson.lastName, aPerson.favoriteColor);
    const fetchedPerson = peopleDb.getPerson(aPerson.id);
    expect(fetchedPerson).toEqual(aPerson);
  });

  it('should be able check if a person is already register', () => {
    const isJeanRegister = peopleDb.isPersonRegister(aPerson.id);
    expect(isJeanRegister).toEqual(true);

    const isArnaudRegister = peopleDb.isPersonRegister(anotherPerson.id);
    expect(isArnaudRegister).toEqual(false);
  });

  it('should be able to note a person as seen or unseen', () => {
    peopleDb.checkPersonAsSeen(aPerson.id);
    let isSeen = peopleDb.isPersonSeen(aPerson.id);
    expect(isSeen).toEqual(true);

    peopleDb.uncheckPersonSeen(aPerson.id);
    isSeen = peopleDb.isPersonSeen(aPerson.id);
    expect(isSeen).toEqual(false);
  });

  it('should be possible to unseen all person', () => {
    peopleDb.addPerson(anSWPerson.id, anSWPerson.firstName,
      anSWPerson.lastName, anSWPerson.favoriteColor);
    peopleDb.addPerson(anotherPerson.id, anotherPerson.firstName,
      anotherPerson.lastName, anotherPerson.favoriteColor);
    peopleDb.checkPersonAsSeen(aPerson.id);
    peopleDb.checkPersonAsSeen(anSWPerson.id);
    peopleDb.checkPersonAsSeen(anotherPerson.id);
    peopleDb.uncheckAllPersonSeen();

    let isSeen = peopleDb.isPersonSeen(aPerson.id);
    expect(isSeen).toEqual(false);
    isSeen = peopleDb.isPersonSeen(anSWPerson.id);
    expect(isSeen).toEqual(false);
    isSeen = peopleDb.isPersonSeen(anotherPerson.id);
    expect(isSeen).toEqual(false);
  });

  it('should be able to delete a person', () => {
    peopleDb.deletePerson(aPerson.id);
    const isPersonRegister = peopleDb.isPersonRegister(aPerson.id);
    expect(isPersonRegister).toEqual(false);
  });

  afterAll(() => {
    // delete other person to clean the file
    peopleDb.deletePerson(aPerson.id);
    peopleDb.deletePerson(anotherPerson.id);
    peopleDb.deletePerson(anSWPerson.id);
  });
});
