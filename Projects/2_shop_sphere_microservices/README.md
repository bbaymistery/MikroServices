# 🛒 2_shop_sphere_microservices - NestJS Monorepo Kurulum & Başlangıç Rehberi

Bu rehber, **ShopSphere E-Ticaret Mikroservis Platformu**'nun NestJS Monorepo mimarisi ile adım adım sıfırdan nasıl kurulacağını ve çalıştırılacağını açıklamaktadır. 

---

## 📌 Neden NestJS Monorepo?

* **Tek Repository (Single Repo):** Tüm mikroservisler (`auth-service`, `product-service`, `order-service` vb.) ve ortak kütüphaneler (`libs/common`) tek bir proje altında toplanır.
* **Kod ve Tip Paylaşımı:** DTO'lar, veritabanı entity'leri, filtreler ve decorator'lar tek bir `libs` klasöründe tutulup tüm mikroservisler tarafından ortak kullanılır.
* **Kolay Geliştirme:** Her servis bağımsız bir port veya IPC kanalından çalışır, `nest start <app-name>` ile tekil olarak başlatılabilir.

---

## 🚀 Adım Adım Kurulum Komutları (Komut Rehberi)

Aşağıdaki komutları sırasıyla terminalinizde (`Projects/2_shop_sphere_microservices` klasöründe) çalıştıracaksınız:

### 1. Temel NestJS Projesini Başlatma (Monorepo Hazırlığı)
```bash
npx @nestjs/cli new . --package-manager npm --strict --skip-git
```
* **Açıklama:** Bulunduğumuz klasörde (`.`) bağımsız bir NestJS projesi şablonu oluşturur. `--skip-git` seçeneği ana depodaki Git yapısını bozmamak için kullanılır.

---

### 2. NestJS Projesini Monorepo Mimarisine Dönüştürme
Projemizde ilk mikroservisimizi oluşturduğumuzda NestJS CLI otomatik olarak projeyi Monorepo yapısına (`apps/` ve `libs/` klasör düzeni) çevirecektir.

#### A. Kimlik Doğrulama Servisini (Auth Service) Oluşturma:
```bash
npx nest g app auth-service
```
* **Açıklama:** `apps/auth-service` klasörü oluşturur ve projeyi Monorepo mimarisine yükseltir.

#### B. Ürün Servisini (Product Service) Oluşturma:
```bash
npx nest g app product-service
```
* **Açıklama:** `apps/product-service` klasörü altında ürün yönetimi mikroservisini oluşturur.

#### C. Müşteri Yönetim Servisini (Customer Service) Oluşturma:
```bash
npx nest g app customer-service
```
* **Açıklama:** `apps/customer-service` profil ve müşteri yönetimi servisini oluşturur.

#### D. Sipariş Servisini (Order Service) Oluşturma:
```bash
npx nest g app order-service
```
* **Açıklama:** `apps/order-service` sipariş işleme servisini oluşturur.

#### E. Bildirim Servisini (Notification Service) Oluşturma:
```bash
npx nest g app notification-service
```
* **Açıklama:** `apps/notification-service` e-posta ve SMS bildirim servisini oluşturur.

#### F. API Gateway Servisini Oluşturma:
```bash
npx nest g app api-gateway
```
* **Açıklama:** `apps/api-gateway` dış dünyadan (Frontend / Mobil) gelen tüm istekleri karşılayan ve mikroservislere yönlendiren giriş kapısını oluşturur.

---

### 3. Ortak Kütüphane (Common Library) Oluşturma
Bütün servislerin ortak kullanacağı DTO'lar, Exception Filter'lar ve Helper fonksiyonlar için ortak kütüphane:
```bash
npx nest g lib common
```
* **Açıklama:** `libs/common` klasörü oluşturur. Böylece tüm servisler `@app/common` takma adıyla ortak kodları import edebilir.

---

## 🏗️ Monorepo Klasör Yapısı (Kurulum Sonrası)

```
2_shop_sphere_microservices/
├── apps/
│   ├── api-gateway/          <-- Dış dünyaya açılan tek giriş kapısı (Port 3000)
│   ├── auth-service/         <-- JWT & Kullanıcı Giriş/Kayıt Servisi (Port 3001)
│   ├── product-service/      <-- Ürün Kataloğu & Stok Servisi (Port 3002)
│   ├── customer-service/     <-- Müşteri Profil & Adres Servisi (Port 3003)
│   ├── order-service/        <-- Sipariş Oluşturma Servisi (Port 3004)
│   └── notification-service/ <-- Asenkron Bildirim Servisi (Port 3005)
├── libs/
│   └── common/               <-- Ortak DTO'lar, Config ve Helper Kodlar
├── nest-cli.json             <-- Monorepo Yönetim Konfigürasyonu
├── package.json              <-- Proje Bağımlılıkları
└── README.md                 <-- Kurulum Rehberi
```

---

## ⚡ Servisleri Çalıştırma Komutları

Geliştirme aşamasında istediğiniz servisi tek başına ayağa kaldırabilirsiniz:

```bash
# Auth Servisini Çalıştırma (Dev Mode)
npm run start:dev auth-service

# Product Servisini Çalıştırma (Dev Mode)
npm run start:dev product-service

# API Gateway'i Çalıştırma (Dev Mode)
npm run start:dev api-gateway
```

---

## 🎯 Bir Sonraki Adım
Terminalinizde `Projects/2_shop_sphere_microservices` klasörüne gidip **1. Adımdaki komutla** kuruluma başlayabilirsiniz!
