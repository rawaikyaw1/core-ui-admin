'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    type: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    models.User.belongsTo(models.Type, {
      onDelete : "CASCADE",
      foreignKey : 'type'
    });
  };
  return User;
};