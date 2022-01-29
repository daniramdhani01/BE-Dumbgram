'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tb_comments.belongsTo(models.tb_users, {
        as: 'user',
        foreignKey: {
          name: 'idUser'
        }
      })
    }
  }
  tb_comments.init({
    idUser: DataTypes.INTEGER,
    idFeed: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'tb_comments',
  });
  return tb_comments;
};