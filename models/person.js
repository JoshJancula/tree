
module.exports = function(sequelize, DataTypes) {
  var Person = sequelize.define("Person", {
    name: { // email address
     id: { // we will use this as primary key
      type: DataTypes.INTEGER,
      primaryKey: true
    },
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    low: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    high: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  });
   Person.associate = function(models) {
    // Associating this person with their numbers
    Person.hasMany(models.LuckyNumber, {
      onDelete: "cascade"
    });
  };
  return Person;
};

