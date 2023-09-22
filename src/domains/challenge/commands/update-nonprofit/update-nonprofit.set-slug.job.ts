import { IJob, Job } from '@app/modules/job';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import slugify from 'slugify';

import NonprofitEntity from '../../entities/nonprofit.entity';

/**
 * Temp job to populate nonprofits without slug. Can be deprecated after run in prod
 */

@Job('SetNonprofitSlugs')
export class UpdateNonprofitSetSlugJob implements IJob {
  constructor(
    @InjectRepository(NonprofitEntity)
    private nonprofitRepo: EntityRepository<NonprofitEntity>,
  ) {}

  async run(): Promise<void> {
    const nonprofitsWithoutSlug = await this.nonprofitRepo.findAll();
    nonprofitsWithoutSlug.forEach((np) => {
      // eslint-disable-next-line no-param-reassign
      np.slug = slugify(np.name, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: true,
        locale: 'en',
        trim: true,
      });
      this.nonprofitRepo.persist(np);
    });
    await this.nonprofitRepo.flush();
  }
}
