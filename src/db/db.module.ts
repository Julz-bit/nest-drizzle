import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg';
import * as schema from './schema';

export const DRIZZLE = Symbol("drizzle-connection")
@Module({
    providers: [
        {
            provide: DRIZZLE,
            useFactory: async (configService: ConfigService) => {
                const databaseUrl = configService.get<string>('DATABASE_URL');
                const pool = new Pool({
                    connectionString: databaseUrl
                });
                return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>
            },
            inject: [ConfigService]
        }
    ],
    exports: [DRIZZLE]
})
export class DbModule { }
