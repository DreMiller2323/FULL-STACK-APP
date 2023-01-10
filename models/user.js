
module.exports = function(sequelize, DataTypes) {
  
  return sequelize.define('users', {
    UserId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FirstName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    LastName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: true
    },

    Password: {
      type: DataTypes.STRING(45),
      allowNull: true
    },

}, {





 tableName: 'users'
  });
};
