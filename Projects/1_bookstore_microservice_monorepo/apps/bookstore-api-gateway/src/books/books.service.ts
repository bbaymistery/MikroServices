import { Inject, Injectable } from '@nestjs/common';
// 1️⃣ ORTAK KONTRAT KÜTÜPHANESİNDEN GELEN DTO'LAR (TCP Mikroservis İletişim Tipleri)
import {
  BOOK_PATTERNS,
  BookDto as ClientBookDto,
  CreateBookDto as ClientCreateBookDto,
  UpdateBookDto as ClientUpdateBookDto,
} from '@app/contracts';
import { ClientProxy } from '@nestjs/microservices';

// 2️⃣ API GATEWAY'İN KENDİ YEREL DTO'LARI (HTTP İstemciden,Clientden  / Body'den Gelen Tipler)
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

import { BOOKS_CLIENT } from './constant';

/**
 * 💡 Neden 3 Tane DTO Görünüyor? (TypeScript Generics Açıklaması)
 * 
 * send<ResponseType, RequestType>(pattern, payload)
 * 
 * - 1. DTO (createBookDto: CreateBookDto): HTTP İsteğinden (Body) gelen yerel verinin tipidir.
 * - 2. DTO (ClientBookDto - İlk Jenerik <TResult>): Mikroservisten GERİ DÖNECEK olan yanıtın (Response) tipidir.
 * - 3. DTO (ClientCreateBookDto - İkinci Jenerik <TInput>): TCP mesajıyla Mikroservise GÖNDERİLECEK olan verinin (Payload) tipidir.
 */
@Injectable()
export class BooksService {
  constructor(@Inject(BOOKS_CLIENT) private readonly booksClient: ClientProxy) {}

  /**
   * Yeni Kitap Ekleme
   * send<ClientBookDto, ClientCreateBookDto>(...)
   * - ClientBookDto -> Dönen yanıt (Tek bir Kitap objesi)
   * - ClientCreateBookDto -> İletilen veri (Eklenecek kitap bilgileri)
   */
  create(createBookDto: CreateBookDto) {
    return this.booksClient.send<ClientBookDto, ClientCreateBookDto>(
      BOOK_PATTERNS.CREATE,
      createBookDto,
    );
  }

  /**
   * Tüm Kitapları Getirme
   * send<ClientBookDto[]>(...)
   * - ClientBookDto[] -> Dönen yanıt (Kitaplar dizisi / Array)
   * - İkinci jenerik yazılmadı çünkü gönderilen mesaj verisi boş {} objesidir.
   */
  findAll() {
    return this.booksClient.send<ClientBookDto[]>(BOOK_PATTERNS.FIND_ALL, {});
  }

  /**
   * Tek Bir Kitap Getirme
   * send<ClientBookDto>(..., id)
   * - ClientBookDto -> Dönen yanıt (Tek bir Kitap objesi)
   */
  findOne(id: number) {
    return this.booksClient.send<ClientBookDto>(BOOK_PATTERNS.FIND_ONE, id);
  }

  /**
   * Kitap Güncelleme
   * send<ClientBookDto, ClientUpdateBookDto>(...)
   * - ClientBookDto -> Dönen yanıt (Güncellenmiş Kitap objesi)
   * - ClientUpdateBookDto -> İletilen veri ({ id, ...updateBookDto })
   */
  update(id: number, updateBookDto: UpdateBookDto) {
    return this.booksClient.send<ClientBookDto, ClientUpdateBookDto>(
      BOOK_PATTERNS.UPDATE,
      { id, ...updateBookDto },
    );
  }

  /**
   * Kitap Silme
   * send<ClientBookDto>(..., id)
   * - ClientBookDto -> Dönen yanıt (Silinen Kitap objesi veya durum mesajı)
   */
  remove(id: number) {
    return this.booksClient.send<ClientBookDto>(BOOK_PATTERNS.REMOVE, id);
  }
}
