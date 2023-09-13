import cloudinaryBase from 'cloudinary';
import { CloudinaryService } from './media.files';

jest.mock('cloudinary');

describe('Given the class CloudinaryService', () => {
  cloudinaryBase.v2 = {
    config: jest.fn().mockReturnValue({}),
    uploader: {},
  } as unknown as typeof cloudinaryBase.v2;

  describe('When it is Instantiated', () => {
    const cloudinary = new CloudinaryService();
    beforeEach(() => {
      cloudinaryBase.v2.uploader.upload = jest
        .fn()
        // eslint-disable-next-line camelcase
        .mockResolvedValue({ public_id: 'Test image' });
    });
    test('Then, when we use the method uploadImage', async () => {
      const imdData = await cloudinary.uploadImage('');
      expect(imdData).toHaveProperty('id', 'Test image');
    });
  });
  describe('When we instantiated with errors', () => {
    const cloudinary = new CloudinaryService();
    beforeEach(() => {
      cloudinaryBase.v2.uploader.upload = jest.fn().mockRejectedValue({
        error: new Error('Upload error'),
      });
    });
    test('Then, uploadImage should throw an error', async () => {
      expect(cloudinary.uploadImage('')).rejects.toThrow();
    });
  });
});
