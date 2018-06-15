module.exports = function(sequelize, DataTypes) {
  var LuckyNumber = sequelize.define("LuckyNumber", {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },

  });

  Number.associate = function(models) {
    LuckyNumber.belongsTo(models.Person, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return LuckyNumber;
};
