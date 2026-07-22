# Işıltı — Günlük Olumlama Uygulaması (Prototip)

Bu repo, "Işıltı" adlı günlük olumlama (daily affirmation) mobil uygulamasının
React tabanlı, tek dosyalık interaktif bir prototipini içerir.

## İçerik

- `isilti-app.jsx` — Onboarding akışı, kategori bazlı olumlama akışı, favoriler,
  seri (streak) takibi, koyu/açık tema, widget önizlemesi ve premium ödeme
  duvarını içeren tek dosyalık React bileşeni. Supabase REST API'sine doğrudan
  `fetch` ile bağlanacak şekilde hazırlanmıştır (ekstra kütüphane gerekmez).
- `isilti-supabase-schema.sql` — Supabase projenizde çalıştırmanız gereken
  tablo şeması (`kullanicilar`, `geri_bildirimler`) ve Row Level Security
  politikaları.

## Kurulum

1. Bir Supabase projesi oluşturun.
2. `isilti-supabase-schema.sql` içeriğini Supabase SQL Editor'de çalıştırın.
3. `isilti-app.jsx` dosyasının başındaki şu iki sabiti kendi bilgilerinizle
   doldurun:

   ```js
   const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";
   ```

4. Bileşeni bir React projesine (Vite, Next.js vb.) veya Claude.ai
   artifact'ına yapıştırıp çalıştırın.

## Notlar

- Bu bir prototip/mockup'tır; gerçek bir App Store uygulaması için Expo/React
  Native'e taşınması, native widget (WidgetKit/Swift) eklenmesi ve
  RevenueCat gibi bir abonelik altyapısının entegre edilmesi gerekir.
- Marka adı, renk paleti ve maskotu özgündür; herhangi bir mevcut uygulamanın
  birebir kopyası değildir.
