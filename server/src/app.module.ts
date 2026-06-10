// AppModule은 NestJS 앱의 최상위 모듈입니다.
import { Module } from '@nestjs/common';

// ConfigModule은 .env 파일을 읽을 수 있게 해줍니다.
import { ConfigModule } from '@nestjs/config';

// 로그인/회원가입 기능 모듈입니다.
import { AuthModule } from './auth/auth.module';

// Prisma DB 연결 모듈입니다.
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // isGlobal: true를 설정하면 ConfigService를 모든 모듈에서 사용할 수 있습니다.
    ConfigModule.forRoot({ isGlobal: true }),

    // DB 연결을 앱에 등록합니다.
    PrismaModule,

    // 인증 기능을 앱에 등록합니다.
    AuthModule,
  ],
})
export class AppModule {}