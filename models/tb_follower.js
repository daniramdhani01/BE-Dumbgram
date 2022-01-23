'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_follower extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_follower.belongsTo(models.tb_users, {
        as: 'user',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  }
  tb_follower.init({
    idUser: DataTypes.INTEGER,
    idFollower: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_follower',
  });
  return tb_follower;
};