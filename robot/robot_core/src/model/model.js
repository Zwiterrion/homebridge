/**
 * In this file you can create the database objects that the application will use 
 */

const LowDbWrapper = require('./lowdbImpl');
const PeopleModel = require('./people');

const FILE_PATH = './model/data/people.json';

const peopleLowDb = new LowDbWrapper(FILE_PATH);
const peopleDb = new PeopleModel(peopleLowDb);

module.exports = peopleDb;
