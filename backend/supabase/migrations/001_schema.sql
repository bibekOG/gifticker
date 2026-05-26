-- Articles table
create table if not exists articles (
  slug        text primary key,
  hero_image  text not null,
  tag         text not null,
  tag_color   text not null default 'text-primary bg-primary/10',
  read_time   text not null default '5 MIN READ',
  title       text not null,
  description text not null,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Newsletter subscribers
create table if not exists subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- File uploads
create table if not exists uploads (
  id            uuid primary key default gen_random_uuid(),
  original_name text not null,
  file_name     text not null,
  mime_type     text not null,
  size          integer not null,
  storage_path  text not null,
  created_at    timestamptz not null default now()
);

-- Indexes
create index if not exists idx_subscribers_email on subscribers (email);
create index if not exists idx_articles_tag on articles (tag);
