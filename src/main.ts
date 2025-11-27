import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  let cachedOrigins: string[] = [];
  let lastFetched = 0;
  const CACHE_DURATION = 30 * 1000;
  app.use(
    cors({
      origin: async (origin, callback) => {
        try {
          const now = Date.now();
          if (
            now - lastFetched > CACHE_DURATION ||
            cachedOrigins.length === 0
          ) {
            const httpService = app.get(HttpService);
            const url = process.env.BASE_TENANTS_URL;
            console.log('TENANTS_URL => ', url);
            if (!url) return callback(new Error('Not allowed by CORS'));
            const response = await lastValueFrom(
              httpService.get(url + `/api/tenants/allowed-origins`),
            );
            console.log('response.data => ', response.data);
            cachedOrigins = response.data;
            lastFetched = now;
          }
          if (!origin || process.env.NODE_ENV === 'development')
            return callback(null, true);
          if (cachedOrigins.includes(origin)) {
            return callback(null, true);
          } else {
            return callback(new Error('Not allowed by CORS'));
          }
        } catch (err) {
          return callback(new Error('CORS check failed'));
        }
      },
      credentials: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
