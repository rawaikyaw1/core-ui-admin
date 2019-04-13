'use strict';
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    name: DataTypes.STRING,
    permission: DataTypes.STRING
  }, {});
  Type.associate = function(models) {
    // associations can be defined here
    models.Type.hasMany(models.User, {
      onDelete: "CASCADE",
      foreignKey : "type"
    });
  };
  return Type;
};