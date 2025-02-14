// data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { JobOffer } from './model/job-offer.entity';
export const datasourceOpts={
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env?.DATABASE_PORT || '') || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '123456',
    database: process.env.DATABASE_NAME ||'job_portal' ,
    entities: [JobOffer],
     // Add your entities here
    synchronize: true, // Set to false in production
    migrations: ['./src/migrations/*.ts'],

    logging: true,
} as DataSourceOptions;
export const AppDataSource = new DataSource(datasourceOpts);