import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { PdfService } from './service/pdf.service';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PdfService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AppController)
  }
}
