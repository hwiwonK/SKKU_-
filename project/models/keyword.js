'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keyword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.keyword.belongsTo(models.user, {
        foreignKey: 'userId',
        targetKey: 'googleid',
        onDelete: 'cascade'
      });

      models.keyword.belongsTo(models.file, {
        foreignKey: 'fileId',
        targetKey: 'id',
        onDelete: 'cascade'
      });
    }
  };
  keyword.init({
    keywordname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'keyword',
  });
  return keyword;
};