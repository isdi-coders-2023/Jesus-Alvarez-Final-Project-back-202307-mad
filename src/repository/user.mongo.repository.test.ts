import { UserModel } from './user.mongo.model';
import { UserMongoRepository } from './user.mongo.repository';

jest.mock('./user.mongo.model');

describe('Given the class UserMongoRepository', () => {
  let repo: UserMongoRepository;

  beforeEach(() => {
    repo = new UserMongoRepository();
  });

  describe('When it is instantiated and its methods are called', () => {
    test('Then, in getAll()', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const result = await repo.getAll();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    test('Then, in getById()', async () => {
      const execMock = jest.fn().mockResolvedValueOnce([]);
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      const data = await repo.getById('');
      expect(execMock).toHaveBeenCalled();
      expect(data).toEqual([]);
    });
    test('Then, when getById() didnt found the user', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then, when the method create() is called', async () => {
      const mockUser = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        avatar: {
          id: '',
          width: 1,
          height: 1,
          format: '',
          url: '',
        },
        reviews: ['o'],
        role: '',
      };
      UserModel.create = jest.fn().mockReturnValueOnce(mockUser);
      const newUser = await repo.create(mockUser);

      expect(newUser).toEqual(mockUser);
    });
    test('Then, when the method update() is called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const updatedUser = await repo.update('', {});
      expect(mockExec).toHaveBeenCalled();
      expect(updatedUser).toEqual([]);
    });
    test('Then, when the method update() didnt found the user', () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.update('', {})).rejects.toThrow();
    });
    test('Then, when the method delete() is called', async () => {
      const mockExec = jest.fn().mockReturnValueOnce({});
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const result = await repo.delete('');
      expect(result).toBe(undefined);
    });
    test('Then, when the method delete didnt find an user', () => {
      const execMock = jest.fn().mockReturnValueOnce(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
  });
});
