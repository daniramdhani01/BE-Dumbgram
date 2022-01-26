'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_follows extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_follows.belongsTo(models.tb_users, {
        as: 'userFollowing',
        foreignKey: {
          name: 'idFollowing'
        }
      })

      tb_follows.belongsTo(models.tb_users, {
        as: 'userFollower',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  }
  tb_follows.init({
    idUser: DataTypes.INTEGER,
    idFollowing: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_follows',
  });
  return tb_follows;
};