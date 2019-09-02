import Sequelize from 'sequelize';
import Mongoose from 'mongoose';

import DatabaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Meetup from '../app/models/Meetup';
import Subscription from '../app/models/Subscription';

const models = [User, File, Meetup, Subscription];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(DatabaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = Mongoose.connect(
      'mongodb://localhost:27017/meetapp',
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
