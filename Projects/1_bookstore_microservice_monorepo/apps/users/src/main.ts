import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

/**
 * NestJS Mikroservis Başlatıcı (Users Microservice)
 * 
 * Standart bir HTTP sunucusunda Controller'lar HTTP isteklerini (GET, POST vb.) dinler ve HTTP yanıtı döner.
 * Mikroservis mimarisinde ise Controller'lar Mesajları (Messages) ve Olayları (Events) dinler:
 * 
 * 1. @MessagePattern() -> Request-Response İletişimi:
 *    - İki yönlü iletişimdir. İsteği gönderen servis yanıt bekler (Örn: Kullanıcı bilgilerini getirme).
 * 
 * 2. @EventPattern() -> Event-Based (Olay Tabanlı) İletişim:
 *    - Tek yönlü iletişimdir (Publish-Subscribe / Fire-and-Forget).
 *    - İsteği gönderen servis yanıt beklemez, sadece olayı duyurur (Örn: Kullanıcı kayıt oldu olayı).
 */
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001, // Users mikroservisinin dinlediği TCP portu
      },
    },
  );

  await app.listen();
}
bootstrap();

