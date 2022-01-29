'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_likes.belongsTo(models.tb_users, {
        as: 'user',
        foreignKey: {
          name: 'idUser'
        }
      })

      tb_likes.belongsTo(models.tb_feeds, {
        as: 'feed',
        foreignKey: {
          name: 'idFeed'
        }
      })

    }
  }
  tb_likes.init({
    idUser: DataTypes.INTEGER,
    idFeed: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_likes',
  });
  return tb_likes;
};