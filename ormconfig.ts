import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { CustomLogger } from './CustomLogger';

// Load environment variables from .env file
dotenv.config();

// Rest of the configuration remains the same
const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  logger: new CustomLogger(['log', 'error', 'info', 'warn']),
  ssl: true,
});

export default config;
