'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class folder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.folder.hasMany(models.file, {
        foreignKey : 'folderId',
        sourceKey : 'id'
      });

      models.folder.belongsTo(models.user, {
        foreignKey: 'userId',
        targetKey: 'googleid',
        onDelete: "cascade"
      });
    }
  };
  folder.init({
    foldername: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'folder',
  });
  return folder;
};