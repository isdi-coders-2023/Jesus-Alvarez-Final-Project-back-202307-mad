import { Review } from '../entities/review';
import { ReviewModel } from './review-mongo-model';
import { ReviewMongoRepository } from './review-mongo-repository';

jest.mock('./review-mongo-model');

describe('Given the class ReviewMongoRepository', () => {
  let repo: ReviewMongoRepository;

  beforeEach(() => {
    repo = new ReviewMongoRepository();
  });

  describe('When it is instantiated and its methods are called', () => {
    test('Then, in getAll()', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);
      ReviewModel.find = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const result = await repo.getAll();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    test('Then, in getById()', async () => {
      const execMock = jest.fn().mockResolvedValueOnce([]);
      ReviewModel.findById = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      const data = await repo.getById('');
      expect(execMock).toHaveBeenCalled();
      expect(data).toEqual([]);
    });
    test('Then, when getById() didnt found the user', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      ReviewModel.findById = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then, when the method create() is called', async () => {
      const mockUser = {
        email: '',
      } as unknown as Review;
      ReviewModel.create = jest.fn().mockReturnValueOnce(mockUser);
      const newUser = await repo.create(mockUser);

      expect(newUser).toEqual(mockUser);
    });
    test('Then, when the method update() is called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);
      ReviewModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const updatedUser = await repo.update('', {});
      expect(mockExec).toHaveBeenCalled();
      expect(updatedUser).toEqual([]);
    });
    test('Then, when the method update() didnt found the user', () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      ReviewModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.update('', {})).rejects.toThrow();
    });
    test('Then, when the method delete() is called', async () => {
      const mockExec = jest.fn().mockReturnValueOnce({});
      ReviewModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const result = await repo.delete('');
      expect(result).toBe(undefined);
    });
    test('Then, when the method delete didnt find an user', () => {
      const execMock = jest.fn().mockReturnValueOnce(null);
      ReviewModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
    test('Then, when the method search() is called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([{}]);
      ReviewModel.find = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const key = 'userName';
      const value = 'Kubo';
      await repo.search({ key, value });
      expect(mockExec).toHaveBeenCalled();
    });
  });
});
