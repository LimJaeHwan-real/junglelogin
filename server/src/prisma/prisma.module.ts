import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global()을 붙이면 AppModule에 한 번만 등록해도 다른 곳에서 PrismaService를 사용할 수 있습니다.
@Global()
@Module({
  // NestJS가 PrismaService 객체를 만들어 관리합니다.
  providers: [PrismaService],

  // 다른 모듈에서도 PrismaService를 쓸 수 있게 내보냅니다.
  exports: [PrismaService],
})
export class PrismaModule {}
