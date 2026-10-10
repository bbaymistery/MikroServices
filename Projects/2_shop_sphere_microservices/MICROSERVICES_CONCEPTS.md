# 📖 Mikroservis Mimarisi Temel Kavramlar & Terimler Sözlüğü (Microservices Glossary)

Bu doküman, üretim ortamındaki (Production) profesyonel bir **Mikroservis Mimarisi** içerisinde kullanılan tüm teknik kavramları, ne işe yaradıklarını ve neden kullanıldıklarını sade, anlaşılır ve örneklendirilmiş bir şekilde açıklamaktadır.

---

## 📌 İçindekiler
1. [🔌 1. Mikroservis & REST API & Veritabanı Bağlantısı](#1-mikroservis--rest-api--veritabanı-bağlantısı)
2. [📝 2. Centralized Logging (Merkezi Loglama)](#2-centralized-logging-merkezi-loglama)
3. [📊 3. Monitoring & Metrikler (Sistem Sağlığı İzleme)](#3-monitoring--metrikler-sistem-sağlığı-izleme)
4. [🕵️ 4. Distributed Tracing (Dağıtık İzleme & Takip)](#4-distributed-tracing-dağıtık-izleme--takip)
5. [🔄 5. Context Propagation & Correlation ID](#5-context-propagation--correlation-id)
6. [⏱️ 6. Retry Mekanizması & Timeout Management](#6-retry-mekanizması--timeout-management)
7. [⚡ 7. Circuit Breaker (Devre Kesici)](#7-circuit-breaker-devre-kesici)
8. [🚦 8. Rate Limiting & Throttling (İstek Sınırlama)](#8-rate-limiting--throttling-istek-sınırlama)
9. [🐳 9. Containerization (Konteynerleştirme - Docker)](#9-containerization-konteynerleştirme---docker)
10. [🚀 10. Deployment & CI/CD Süreçleri](#10-deployment--cicd-süreçleri)
11. [📈 11. Auto-Scaling (Otomatik Ölçekleme - Scale Up / Down)](#11-auto-scaling-otomatik-ölçekleme---scale-up--down)
12. [🧩 12. Diğer Kritik Kavramlar (Message Queue, Service Discovery, Saga)](#12-diğer-kritik-kavramlar)

---

### 🔌 1. Mikroservis & REST API & Veritabanı Bağlantısı

* **REST API:** Servislerin birbirleriyle veya dış dünyayla standart HTTP protokolü (GET, POST, PUT, DELETE) üzerinden haberleşmesini sağlayan arayüzdür.
* **Database per Service (Servise Özel Veritabanı):** Her mikroservis **sadece kendi veritabanına** erişebilir. `Product Service` gidip doğrudan `Order DB`'sine SQL sorgusu atamaz!
* **Veritabanı Bağlantısı:** Servisler NestJS içinde ORM/ODM (TypeORM, Prisma, Mongoose) kullanarak kendi veritabanına bağlanır. Servisler arası veri ihtiyacı API veya Message Queue ile karşılanır.

---

### 📝 2. Centralized Logging (Merkezi Loglama)

* **Nedir?:** Monolitikte tüm loglar tek bir dosyaya yazılırdı. Ancak 20 farklı mikroservis çalıştığında, logları sunucu sunucu gezerek okumak imkansızdır.
* **Nasıl Çalışır?:** Tüm servisler ürettikleri logları (Hata, Bilgi, Uyarı) merkezi bir log sunucusuna (örneğin **Elasticsearch + Logstash + Kibana (ELK Stack)** veya **Seq**) anlık olarak gönderir.
* **Faydası:** Sistemdeki tüm servislerin logları tek bir ekranda filtrelenebilir ve taranabilir.

---

### 📊 3. Monitoring & Metrikler (Sistem Sağlığı İzleme)

* **Nedir?:** Servislerin anlık CPU kullanımı, RAM tüketimi, saniyedeki istek sayısı (RPS) ve ortalama yanıt sürelerini izleme sürecidir.
* **Health Checks (Sağlık Kontrolü):** `/health` endpoint'i üzerinden servisin ve bağlı olduğu veritabanının ayakta olup olmadığını kontrol eder.
* **Popüler Araçlar:** **Prometheus** (metrikleri toplar) ve **Grafana** (toplanan verileri görsel panolarda/grafiklerde gösterir).

---

### 🕵️ 4. Distributed Tracing (Dağıtık İzleme & Takip)

* **Nedir?:** Kullanıcının attığı tek bir isteğin arka planda 5 farklı mikroservisten geçerken izlediği rotayı ve her serviste kaç milisaniye harcandığını adım adım görselleştirme tekniğidir.
* **Neden Gerekli?:** Müşteri "Sepeti Onayla" butonuna bastığında yanıt 3 saniye sürüyorsa, yavaşlığın `Product Service`'ten mi, `Payment Service`'ten mi yoksa `Database`'den mi kaynaklandığını anında tespit etmeyi sağlar.
* **Popüler Araçlar:** **OpenTelemetry**, **Jaeger**, **Zipkin**.

---

### 🔄 5. Context Propagation & Correlation ID (İstek Takip Kodu)

* **Correlation ID:** İstek API Gateway'e girdiğinde üretilen benzersiz bir koddur (örneğin `req-abc-123-xyz`).
* **Context Propagation:** Bu Correlation ID, istek bir servisten diğer servise geçerken (HTTP Header veya Message Queue mesajı içinde) **servisler boyunca taşınır**.
* **Faydası:** Log sisteminde `req-abc-123-xyz` kodunu arattığınızda, o isteğin dokunduğu tüm servislerdeki loglar sırasıyla dökülür.

---

### ⏱️ 6. Retry Mekanizması & Timeout Management

* **Timeout Management (Zaman Aşımı):** Bir servis başka bir servise istek attığında sonsuza kadar beklemez. Örneğin 2 saniye içinde yanıt gelmezse isteği keser (Timeout) ve hataya düşürür.
* **Retry Mekanizması (Yeniden Deneme):** Ağdaki geçici aksamalar nedeniyle başarısız olan bir isteği hemen pes etmeyip 1-2 defa tekrar deneme (Exponential Backoff ile bekleyerek) mantığıdır.

---

### ⚡ 7. Circuit Breaker (Devre Kesici)

* **Nedir?:** Evlerdeki elektrik sigortası gibidir. Bir mikroservis (örneğin `Payment Service`) sürekli hata veriyor veya yanıt vermiyorsa, diğer servislerin ona istek atıp kaynağını tüketmesini engellemek için **devreyi açar (Open State)** ve istekleri anında geri çevirir.
* **Amaç:** Çöken bir servisin tüm sistemi kilitmesini (Cascading Failure) önlemek.
* **Popüler Kütüphaneler:** **Polly**, **Resilience4j**, NestJS tarafında `@golevelup/nestjs-circuit-breaker`.

---

### 🚦 8. Rate Limiting & Throttling (İstek Sınırlama)

* **Nedir?:** Belli bir IP adresinin veya kullanıcının dakikada atabileceği maksimum istek sayısını sınırlandırma mekanizmasıdır (örneğin dakikada maks. 60 istek).
* **Amaç:** Bot saldırılarını, brute-force şifre denemelerini ve DDoS ataklarını engellemek. Genellikle **API Gateway** seviyesinde uygulanır.

---

### 🐳 9. Containerization (Konteynerleştirme - Docker)

* **Nedir?:** Uygulamayı, çalıştığı işletim sisteminden bağımsız kılmak için gerekli tüm kodları, kütüphaneleri ve ortam değişkenlerini **Docker Image** adı verilen taşınabilir paketler haline getirmektir.
* **Docker Compose:** Birden fazla mikroservisi, PostgreSQL, Redis ve RabbitMQ'yu lokal bilgisayarda tek bir komutla (`docker-compose up`) ayağa kaldırmaya yarar.

---

### 🚀 10. Deployment & CI/CD Süreçleri

* **CI (Continuous Integration - Sürekli Entegrasyon):** Kodu Git'e push ettiğinizde otomatik testlerin (Unit/Integration Test) çalışması.
* **CD (Continuous Deployment - Sürekli Dağıtım):** Testten geçen kodların otomatik olarak Docker Image oluşturup canlı sunuculara (AWS, Kubernetes, Vercel) dağıtılması.

---

### 📈 11. Auto-Scaling (Otomatik Ölçekleme - Scale Up / Down)

* **Scale Out (Yatay Ölçekleme):** Trafik arttığında bir servisin kopyalarının (Instance) sayısını 1'den 5'e çıkarmak.
* **Scale In (Daraltma):** Gece trafik düştüğünde kopyaları kapatıp 1'e düşürmek.
* **Otomatik Ölçekleme (HPA - Horizontal Pod Autoscaler):** Kubernetes veya Cloud ortamının CPU/RAM kullanımına bakarak instance sayısını insan müdahalesi olmadan otomatik artırıp azaltmasıdır.

---

### 🧩 12. Diğer Kritik Kavramlar

* **Service Discovery (Servis Keşfi):** Dinamik olarak açılıp kapanan mikroservislerin IP adreslerini ve portlarını takip eden rehber sunucudur (Consul, Eureka).
* **Saga Pattern:** Mikroservisler arasında dağıtık bir işlemi (Transaction) yönetme desenidir. Bir servis başarısız olursa önceki servislerde yapılan işlemleri geri alır (Compensating Transaction).
* **API Gateway:** Dış dünya ile mikroservisler arasında duran, yönlendirme, güvenlik ve rate limit yapan ana giriş kapısıdır.

---

💡 **Not:** Tüm bu kavramlar, NestJS Monorepo projemizde uygulamalı olarak karşımıza çıkacaktır.
