import Sequelize, { Model } from 'sequelize';

class Subscription extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'subscriber_id',
      as: 'subscriber',
    });

    this.belongsTo(models.Meetup, {
      foreignKey: 'meetup_id',
      as: 'meetup',
    });
  }
}

export default Subscription;
