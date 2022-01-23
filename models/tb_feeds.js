'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tb_feeds extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // tb_feeds.belongsTo(models.tb_users, {
      //   as: 'tb_users',
      //   foreignKey: {
      //     name: 'idUser'
      //   }
      // })
    }
  }
  tb_feeds.init({
    filename: DataTypes.STRING,
    like: DataTypes.INTEGER,
    caption: DataTypes.TEXT,
    idUser: DataTypes.INTEGER,
    idcomment: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'tb_feeds',
  });
  return tb_feeds;
};