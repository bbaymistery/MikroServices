# 🏗️ Monorepo Mikroservis Mimarisi ve İletişim Rehberi

Bu klasör (`apps/`), projemizin **ana damarıdır**. Tüm mikroservisler ve API Gateway uygulamaları burada yer alır.

---

## 📁 Servis Yapısı

| Uygulama / Servis | Tür | Varsayılan İletişim / Port | Görevi |
| :--- | :--- | :--- | :--- |
| **`bookstore-api-gateway`** | API Gateway (HTTP) | HTTP (Port 3000) | Dış dünyadan (Client/Frontend) gelen HTTP isteklerini karşılar ve ilgili mikroservise yönlendirir. |
| **`users`** | Mikroservis | TCP (Port 3001) | Kullanıcı verileri ve işlemlerinden sorumlu iç mikroservis. |
| **`books`** | Mikroservis | TCP (Port 3002) | Kitap kataloğu ve stok işlemlerinden sorumlu iç mikroservis. |

---

## 💡 HTTP Sunucusu vs Mikroservis Mantığı

- **HTTP Sunucusu (API Gateway):** İstemciden (Browser, Postman, Mobil vb.) gelen HTTP (GET, POST, PUT, DELETE) isteklerini karşılar ve HTTP yanıtı döner.
- **Mikroservis (Users & Books):** Dış dünyaya kapalıdır. Servisler arası iletişimde **Controller**'lar HTTP istekleri yerine **Mesajları (Messages)** ve **Olayları (Events)** dinler.

---

## 🔄 Mikroservis İletişim Desenleri (Communication Patterns)

NestJS mikroservislerinde 2 temel iletişim yöntemi kullanılır:

### 1️⃣ `@MessagePattern()` — Request-Response (İki Yönlü İletişim)
* **Mantık:** İsteği gönderen servis, karşı servisten bir **cevap (response)** bekler.
* **Ne Zaman Kullanılır?** Veri sorgulama, hesaplama yapma veya yanıtın sonucuna göre işlem yapılması gerektiğinde.
* **Örnek:** API Gateway'in Users servisinden `user_id` ile kullanıcı detayını istemesi.

```typescript
// Users Service Controller Örneği
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  @MessagePattern({ cmd: 'get_user_by_id' })
  getUserById(@Payload() id: number) {
    return { id, name: 'Ahmet Yılmaz', email: 'ahmet@example.com' };
  }
}
```

---

### 2️⃣ `@EventPattern()` — Event-Based (Olay Tabanlı / Tek Yönlü İletişim)
* **Mantık:** **Fire-and-Forget** (Gönder ve Unut) prensibine dayanır. İsteği gönderen servis yanıt **beklemez**.
* **Ne Zaman Kullanılır?** Yanıt gerektirmeyen, arka planda çalışacak olaylar (Notification, Loglama, E-posta gönderimi vb.) için.
* **Örnek:** Yeni bir kullanıcı kayıt olduğunda `user_created` olayının yayınlanması.

```typescript
// Users Service Controller Örneği
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class UsersController {
  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any) {
    console.log('Yeni kullanıcı oluşturuldu olayı alındı:', data);
    // E-posta gönderme veya loglama gibi arka plan işlemleri yapılır
  }
}
```

---

## 🛠️ Mikroservis Başlatma Örneği (`main.ts`)

`apps/users/src/main.ts` dosyası mikroservisi şu şekilde başlatır:

```typescript
import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3001, // Users mikroservisinin TCP portu
      },
    },
  );

  await app.listen();
}
bootstrap();
```
