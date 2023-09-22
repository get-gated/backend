import { Client, QueryResult } from 'pg';

import nonprofitCategories from './non-profit-categories';
import nonprofits from './non-profits';
import challengeTemplates from './challenge-templates';

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const seedData: string[][] = [
  ['non-profit categories', nonprofitCategories],
  ['non-profits', nonprofits],
  ['challenge templates', challengeTemplates],
];

export default async function run(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    client.connect(async function (err) {
      if (err) {
        return reject(err);
      }

      try {
        for (let i = 0; i < seedData.length; i++) {
          const [name, query] = seedData[i];
          const results = (await client.query(
            query,
          )) as unknown as QueryResult[];
          const count = results.reduce((total, result) => {
            return total + result.rowCount;
          }, 0);
          console.log(`imported ${count} ${name} `);
        }
        console.log('done');
      } catch (e) {
        return reject(e);
      }

      client.end();
      resolve();
    });
  });
}
