import { Test, TestingModule } from '@nestjs/testing';
import { EntityRepository } from '@mikro-orm/postgresql';

import UserRepository from './user.repository';

describe('UserRepository', () => {
  let repo: UserRepository;
  let mockedFind: jest.SpyInstance;
  let mockedFindOne: jest.SpyInstance;
  let mockedCreate: jest.SpyInstance;
  beforeEach(async () => {
    mockedFind = jest.spyOn(EntityRepository.prototype, 'find');
    mockedFindOne = jest.spyOn(EntityRepository.prototype, 'findOne');
    mockedCreate = jest.spyOn(EntityRepository.prototype, 'create');
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    repo = module.get<UserRepository>(UserRepository);
  });
  afterEach(() => {
    mockedFind.mockReset();
    mockedFindOne.mockReset();
    mockedCreate.mockReset();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });
});
