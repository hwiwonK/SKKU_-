'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class file extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.file.hasMany(models.keyword, {
        foreignKey : 'fileId',
        sourceKey : 'id'
      });

      models.file.belongsTo(models.user, {
        foreignKey: 'userId',
        targetKey : 'googleid',
        onDelete: 'cascade'
      });

      models.file.belongsTo(models.folder, {
        foreignKey: 'folderId',
        targetKey : 'id',
        onDelete: 'cascade'
      });
    }
  };
  file.init({
    filename: DataTypes.STRING,
    fileurl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'file',
  });
  return file;
};