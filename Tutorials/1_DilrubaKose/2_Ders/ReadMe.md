# 🏗️ Ders 2: E-Ticaret Mikroservis Sistem Tasarımı (System Design Architecture)

Bu doküman, bir E-Ticaret platformunun ölçeklenebilir, esnek ve yüksek performanslı **Mikroservis Sistem Mimarisi** bileşenlerini, veri akışını ve servis sorumluluklarını detaylandırmaktadır.

---

## 📌 Mimari Bileşenler Şeması

```
                                  +---------------------+
                                  |  Amazon API Gateway |
                                  +----------+----------+
                                             |
                                             v
                                  +----------+----------+
                                  | Elastic Load Balancer|
                                  +----+-----+-----+----+
                                       |     |     |
            +--------------------------+     |     +--------------------------+
            |                                |                                |
            v                                v                                v
+-----------+-----------+        +-----------+-----------+        +-----------+-----------+
| Customer Auth Service |        |   Order Service       |        |  Customer Service     |
| (Register / Login)    |        | (Order Creation)      |        | (Profile & Address)   |
|   +---------------+   |        |   +---------------+   |        |   +---------------+   |
|   | Auth DB       |   |        |   | Order DB      |   |        |   | Customer DB   |   |
|   +---------------+   |        |   +---------------+   |        |   +---------------+   |
+-----------------------+        +---------+-------------+        +-----------------------+
                                           |
                                           | (Event Fırlatma)
                                           v
                                 +---------+-------------+
                                 |  Message Queue        |
                                 |  (Kafka / RabbitMQ)   |
                                 +---------+-------------+
                                           |
                                           | (Event Dinleme)
                                           v
+-----------------------+        +---------+-------------+
| Product Service       |        | Notification Service  |
| (Catalog & Stok)      |        | (Email / SMS)         |
| +----+ +-----+ +----+ |        |   +---------------+   |
| |DB  | |Cache| |S3  | |        |   | Notif DB      |   |
| +----+ +-----+ +----+ |        |   +---------------+   |
+-----------------------+        +-----------------------+
```

---

## 🛠️ Detaylı Mimari Katmanlar ve Bileşenler

### 1. 🚪 Giriş Katmanı (API Gateway & Load Balancer)

#### 🛡️ Amazon API Gateway
* **Rolü:** Dış dünyadan (Mobil Uygulama, Web İstemcileri) gelen tüm isteklerin **tek giriş noktasıdır (Single Point of Entry)**.
* **Sorumlulukları:**
  * **Authentication & Security:** İsteklerin yetkili olup olmadığını denetler (JWT Token doğrulama).
  * **Rate Limiting & Throttling:** Kötü niyetli yoğun istekleri ve DDoS saldırılarını engeller.
  * **Routing:** İstekleri iç ağdaki ilgili mikroservise yönlendirir.

#### ⚖️ Elastic Load Balancing (ELB)
* **Rolü:** API Gateway'den geçen yükü iç ağdaki aktif mikroservis kopyalarına (Instance'larına) dengeli bir şekilde (Round-Robin, Least Connections vb.) dağıtır.

---

### 2. 🧩 Mikroservisler ve Sorumlulukları (Bounded Contexts)

#### A. 🔐 Customer Auth Service (Kimlik Doğrulama Servisi)
* **İşlevi:** Kullanıcı Kayıt (`Register`), Giriş (`Login`), Şifremi Unuttum ve JWT Token üretimi.
* **Veritabanı:** `Auth DB` (Kullanıcı kimlik bilgilerini ve parola hash'lerini saklar).

#### B. 📦 Product Service (Ürün Kataloğu Servisi)
* **İşlevi:** Ürün ekleme, ürün listeleme, kategori yönetimi ve stok takibi.
* **Teknoloji & Performans Katmanları:**
  * **Product DB:** Ürün detay ve fiyat verilerini kalıcı tutar (PostgreSQL / MongoDB).
  * **Redis Cache:** Çok fazla okunan ürün listelerini bellekte (RAM) önbellekleyerek veritabanı yükünü düşürür ve milisaniyelik yanıt sağlar.
  * **AWS S3 Storage:** Ürün görsellerini ve medya dosyalarını saklar.

#### C. 👤 Customer Service (Müşteri Yönetim Servisi)
* **İşlevi:** Müşteri profil bilgileri, teslimat adresleri, sipariş tercihleri.
* **Veritabanı:** `Customer DB`.

#### D. 🛒 Order Service (Sipariş Yönetim Servisi)
* **İşlevi:** Sipariş oluşturma (`Order Creation`), sipariş durum güncellemeleri ve fatura geçmişi.
* **Veritabanı:** `Order DB`.
* **Asenkron Olay Tabanlı Mimari:** Sipariş oluşturulduğunda senkron olarak e-posta gönderilmesini beklemez! Bunun yerine **Message Queue** üzerine `OrderCreatedEvent` yayınlar.

#### E. 🔔 Notification Service (Bildirim Servisi)
* **İşlevi:** Müşteriye SMS, E-posta ve Push Bildirimi gönderme.
* **Veritabanı:** `Notif DB` (Gönderilen bildirim geçmişini saklar).
* **Asenkron Dinleyici:** **Message Queue**'dan gelen `OrderCreatedEvent` mesajlarını dinler ve sipariş onaylandığında müşteriye otomatik e-posta/SMS gönderir.

---

### 3. 🔄 Mesaj Kuyruğu Katmanı (Message Queue / Event Bus)

#### 📬 Kafka / RabbitMQ
* **Amaç:** Servisler arası **Gevşek Bağlılığı (Loose Coupling)** sağlamak.
* **Çalışma Mantığı:** `Order Service` siparişi oluşturduğunda `Notification Service`'in ayakta olup olmadığını beklemez. Mesaj kuyruğa yazılır. Bildirim servisi hazır olduğunda mesajı okur ve işler.
* **Avantajı:** Bildirim servisi geçici olarak çökse bile sipariş alma süreci durmaz (Fault Isolation).

---

### 4. 📋 İş Gereksinimleri (Functional Requirements)

* `* Register/Login`: Güvenli kullanıcı kimlik doğrulaması.
* `* Ürün Listeleme`: Yüksek hızlı önbellekli ürün sorgulama.
* `* Ürünleri Sepete Ekleme`: Anlık sepet yönetimi.
* `* Order Oluşturma`: Olay tabanlı asenkron sipariş süreci.
* `* Order Listeleme`: Müşterinin geçmiş sipariş takibi.
* `* Order Confirmation`: Olay tetiklemeli otomatik sipariş onay bildirimi.

---

> 💡 **Not:** Bu mimarideki tüm servisleri, Redis önbellek katmanını, Message Queue yapısını ve API Gateway'i **NestJS & TypeScript** kullanarak sıfırdan Monorepo mimarisiyle kodlayacağız.
