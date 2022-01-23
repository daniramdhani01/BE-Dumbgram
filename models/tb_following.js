'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_following extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_following.belongsTo(models.tb_users, {
        as: 'user',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  }
  tb_following.init({
    idUser: DataTypes.INTEGER,
    idFollowing: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_following',
  });
  return tb_following;
};