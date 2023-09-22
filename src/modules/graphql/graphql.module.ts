import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DataloaderModule } from '@app/modules/graphql/dataloader/dataloader.module';
import { DataloaderService } from '@app/modules/graphql/dataloader/dataloader.service';
import { AuthFieldMiddleware } from '@app/modules/auth';
import { GqlModuleOptions } from '@nestjs/graphql/dist/interfaces/gql-module-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

import AppConfig from '../../app.config';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [DataloaderModule, ConfigModule.forFeature(AppConfig)],
      inject: [DataloaderService, ConfigService],
      useFactory: (
        dataloaderService: DataloaderService,
        config: ConfigService,
      ): GqlModuleOptions => ({
        autoSchemaFile: true,
        sortSchema: true,
        cors: config.get('app').cors,
        introspection: config.get('app').env !== 'production',
        bodyParserConfig: false, // needs to be disabled per Mikro Orm docs: https://mikro-orm.io/docs/usage-with-nestjs/#request-scoping-when-using-graphql
        buildSchemaOptions: {
          fieldMiddleware: [AuthFieldMiddleware],
        },

        context: ({ req, res, payload, connection }) => ({
          req,
          res,
          payload,
          connection,
          loaders: dataloaderService.createLoaders(),
        }),
      }),
    }),
  ],
  providers: [],
  exports: [GraphQLModule],
})
export class GraphqlModule {}
