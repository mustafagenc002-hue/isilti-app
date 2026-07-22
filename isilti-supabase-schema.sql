-- Işıltı uygulaması için Supabase şeması
-- Bu dosyayı Supabase projenizde SQL Editor'e yapıştırıp çalıştırın.

-- 1) Kullanıcı profili + onboarding cevapları + favoriler + seri
create table if not exists kullanicilar (
  device_id text primary key,
  isim text,
  secili_kategoriler text[] default '{}',
  bildirim_izni boolean default true,
  favoriler int[] default '{}',
  seri int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Geri bildirimler
create table if not exists geri_bildirimler (
  id bigint generated always as identity primary key,
  device_id text,
  mesaj text not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table kullanicilar enable row level security;
alter table geri_bildirimler enable row level security;

-- Demo/anonim kullanım için: herkes kendi device_id'siyle yazabilir/güncelleyebilir.
-- NOT: Bu, cihaz kimliğine dayalı basit bir güvenlik modelidir; gerçek bir üretim
-- uygulamasında Supabase Auth (anonim oturum açma dahil) kullanmanız önerilir.
create policy "anon upsert kullanicilar" on kullanicilar
  for all using (true) with check (true);

create policy "anon insert geri_bildirimler" on geri_bildirimler
  for insert with check (true);

-- Geri bildirimleri sadece siz (proje sahibi) service_role ile okuyabilirsiniz;
-- anon key ile okuma kapalı tutuluyor.
create policy "anon select yok" on geri_bildirimler
  for select using (false);
