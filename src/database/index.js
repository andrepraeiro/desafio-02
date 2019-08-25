import Sequelize from 'sequelize';

import DatabaseConfig from '../config/database';

import Users from '../app/models/User';

const models = [Users];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(DatabaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
