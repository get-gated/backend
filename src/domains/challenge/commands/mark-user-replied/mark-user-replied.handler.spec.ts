import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { LoggerService } from '@app/modules/logger';

import { ChallengeService } from '../../services/challenge.service';
import ChallengeInteractionEntity from '../../entities/challenge-interaction.entity';
import ChallengeEntity from '../../entities/challenge.entity';

import { MarkUserRepliedHandler } from './mark-user-replied.handler';

const repoMock = {
  findOne: jest.fn(),
};

const challengeServiceMock = {
  recordInteraction: jest.fn(),
};

describe('MarkUserReplied Command Handler', () => {
  let handler: MarkUserRepliedHandler;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarkUserRepliedHandler,
        { provide: LoggerService, useValue: console },
        {
          provide: ChallengeService,
          useValue: challengeServiceMock,
        },
        {
          provide: getRepositoryToken(ChallengeInteractionEntity),
          useValue: repoMock,
        },
        {
          provide: getRepositoryToken(ChallengeEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    handler = module.get<MarkUserRepliedHandler>(MarkUserRepliedHandler);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });
});
