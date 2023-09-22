import { Court } from '../entities/court';
import { CourtModel } from './court-mongo-model';
import { CourtMongoRepository } from './court-mongo-repository';

jest.mock('./court-mongo-model');

describe('Given the class CourtMongoRepository', () => {
  let repo: CourtMongoRepository;

  beforeEach(() => {
    repo = new CourtMongoRepository();
  });

  describe('When it is instantiated and its methods are called', () => {
    test('Then, in getAll()', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);
      CourtModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({
          exec: mockExec,
        }),
      });
      const result = await repo.getAll();
      // Expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    test('Then, in getById()', async () => {
      const execMock = jest.fn().mockResolvedValueOnce([]);
      CourtModel.findById = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      const data = await repo.getById('');
      expect(execMock).toHaveBeenCalled();
      expect(data).toEqual([]);
    });
    test('Then, when getById() didnt found the user', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      CourtModel.findById = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.getById('')).rejects.toThrow();
    });
    test('Then, when the method create() is called', async () => {
      const mockCourt = {
        surface: '',
      } as unknown as Court;
      CourtModel.create = jest.fn().mockReturnValueOnce(mockCourt);
      const newCourt = await repo.create(mockCourt);

      expect(newCourt).toEqual(mockCourt);
    });
    test('Then, when the method update() is called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([]);
      CourtModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const updatedCourt = await repo.update('', {});
      expect(mockExec).toHaveBeenCalled();
      expect(updatedCourt).toEqual([]);
    });
    test('Then, when the method update() didnt found the user', () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      CourtModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.update('', {})).rejects.toThrow();
    });
    test('Then, when the method delete() is called', async () => {
      const mockExec = jest.fn().mockReturnValueOnce({});
      CourtModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const result = await repo.delete('');
      expect(result).toBe(undefined);
    });
    test('Then, when the method delete didnt find an user', () => {
      const execMock = jest.fn().mockReturnValueOnce(null);
      CourtModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec: execMock,
      });
      expect(repo.delete('')).rejects.toThrow();
    });
    test('Then, when the method search() is called', async () => {
      const mockExec = jest.fn().mockResolvedValueOnce([{}]);
      CourtModel.find = jest.fn().mockReturnValueOnce({
        exec: mockExec,
      });
      const key = 'userName';
      const value = 'Kubo';
      await repo.search({ key, value });
      expect(mockExec).toHaveBeenCalled();
    });
  });
});
