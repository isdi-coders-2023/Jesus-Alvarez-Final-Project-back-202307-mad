import cloudinaryBase from 'cloudinary';
import { ImageData } from '../types/image.js';
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
      cloudinaryBase.v2.url = jest.fn();
      const newPic: ImageData = {
        id: '1',
        format: '',
        url: '',
      } as unknown as ImageData;
      const imdData = await cloudinary.uploadImage('');
      cloudinary.resizeImage(newPic);
      expect(cloudinaryBase.v2.url).toHaveBeenCalled();
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
