import { Test, TestingModule } from '@nestjs/testing';

import PatternRepository from './pattern.repository';

describe('PatternRepository', () => {
  let repo: PatternRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatternRepository],
    }).compile();
    repo = module.get<PatternRepository>(PatternRepository);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });
});
