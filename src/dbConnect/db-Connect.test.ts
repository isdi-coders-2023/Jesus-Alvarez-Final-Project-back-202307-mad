describe('Given the function dbConnect', () => {
  jest.mock('mongoose', () => ({
    connect: jest.fn(),
  }));
  const mongoose = require('mongoose');
  const { dbConnect } = require('./db-Connect.ts');
  describe('When it is called', () => {
    process.env.DB_USER = 'testUser';
    process.env.DB_PASSWORD = 'testPassword';
    test('The method connect() from mongoose should be call', () => {
      dbConnect();
      expect(mongoose.connect).toHaveBeenCalled();
    });
  });
});
