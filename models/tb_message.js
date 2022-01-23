'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_message.belongsTo(models.tb_users, {
        as: 'tb_users',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  }
  tb_message.init({
    message: DataTypes.TEXT,
    idUser: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_message',
  });
  return tb_message;
};