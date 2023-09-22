import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';

import ConnectionRepository from './connection.repository';

describe('ConnectionRepository', () => {
  let repo: ConnectionRepository;
  let mockedFindOne: jest.SpyInstance;

  beforeEach(async () => {
    mockedFindOne = jest.spyOn(EntityRepository.prototype, 'findOne');
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionRepository],
    }).compile();

    repo = module.get<ConnectionRepository>(ConnectionRepository);
  });

  afterEach(() => {
    mockedFindOne.mockReset();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });
});
