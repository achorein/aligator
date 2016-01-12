'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/aligator-test'
  },
  sequelize: {
    uri: 'sqlite://',
    options: {
      logging: false,
      storage: 'test.sqlite',
      define: {
        timestamps: false
      }
    }
  }
};
