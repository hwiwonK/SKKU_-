'use strict';
const {
  Model
} = require('sequelize');
const keyword = require('./keyword');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.file, {
        foreignKey : 'userId',
        sourceKey : 'googleid'
      });
      models.user.hasMany(models.folder, {
        foreignKey : 'userId',
        sourceKey : 'googleid'
      });
      models.user.hasMany(models.keyword, {
        foreignKey : 'userId',
        sourceKey : 'googleid'
      });
    }
  };
  user.init({
    googleid: {
      type : DataTypes.STRING,
      allowNull : false,
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};