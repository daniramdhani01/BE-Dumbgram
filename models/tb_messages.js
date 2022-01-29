'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_messages.belongsTo(models.tb_users, {
        as: 'user',
        foreignKey: {
          name: 'idSender'
        }
      })
    }
  }
  tb_messages.init({
    idSender: DataTypes.INTEGER,
    idReceiver: DataTypes.INTEGER,
    message: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'tb_messages',
  });
  return tb_messages;
};