import { Test, TestingModule } from '@nestjs/testing';
import { EntityRepository } from '@mikro-orm/postgresql';

import TrainingRepository from './training.repository';

describe('TrainingRepository', () => {
  let repo: TrainingRepository;
  let mockedFind: any;
  let mockedFindOne: any;
  let mockedCreate: any;
  beforeEach(async () => {
    mockedFind = jest.spyOn(EntityRepository.prototype, 'find');
    mockedFindOne = jest.spyOn(EntityRepository.prototype, 'findOne');
    mockedCreate = jest.spyOn(EntityRepository.prototype, 'create');
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingRepository],
    }).compile();
    repo = module.get<TrainingRepository>(TrainingRepository);
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
