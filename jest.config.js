/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'index.ts',
    'app.ts',
    'user.mongo.model.ts',
    'user.router.ts',
    'user.ts',
    'court.mongo.model.ts',
    'court.router.ts',
    'review.mongo.model.ts',
  ],
};
