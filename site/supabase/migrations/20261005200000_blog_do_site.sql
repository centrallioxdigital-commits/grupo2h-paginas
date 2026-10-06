-- Blog do site principal (grupo2h.com.br/blog).
--
-- Mora no mesmo projeto do painel do time (Dashboard 2!H) de propósito:
-- quem publica é o próprio time, com o mesmo login do painel. Quem pode
-- escrever é decidido por private.tem_area('/conteudo'): administradores
-- sempre, colaboradores que tenham a área "Conteúdo" liberada.
--
-- O público (e o robô que gera as páginas do site) só enxerga post com
-- status "publicado" e data de publicação já alcançada, e só as colunas
-- que vão para a página. autor_id nunca sai para o anônimo.

create table public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique
                check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 90),
  titulo        text not null check (char_length(titulo) between 5 and 140),
  resumo        text check (resumo is null or char_length(resumo) <= 300),
  conteudo      text not null default '',
  capa_url      text,
  capa_alt      text,
  categoria     text not null default 'estrategia'
                check (categoria in ('estrategia', 'trafego', 'dados', 'comercial', 'estrutura', 'metodo-5a')),
  tags          text[] not null default '{}',
  status        text not null default 'rascunho' check (status in ('rascunho', 'publicado')),
  publicado_em  timestamptz,
  autor_id      uuid references auth.users (id) on delete set null,
  autor_nome    text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.blog_posts is
  'Posts do blog do site grupo2h.com.br. Escrita: private.tem_area(''/conteudo''). Leitura anônima: só publicado e só as colunas da página. O site gera uma página estática por post a partir desta tabela.';

create index blog_posts_publicados_idx on public.blog_posts (status, publicado_em desc);

-- Carimbos automáticos: data de atualização, data de publicação na primeira
-- vez que vira "publicado", autor e nome do autor a partir do perfil.
create or replace function private.blog_posts_antes_de_gravar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  if tg_op = 'INSERT' then
    new.criado_em := now();
    if new.autor_id is null then
      new.autor_id := auth.uid();
    end if;
  else
    new.criado_em := old.criado_em;
    new.autor_id := old.autor_id;
  end if;
  if new.status = 'publicado' and new.publicado_em is null then
    new.publicado_em := now();
  end if;
  if coalesce(new.autor_nome, '') = '' and new.autor_id is not null then
    select nullif(p.nome, '') into new.autor_nome from public.profiles p where p.id = new.autor_id;
  end if;
  return new;
end;
$$;

revoke all on function private.blog_posts_antes_de_gravar() from public, anon, authenticated;

create trigger blog_posts_antes_de_gravar
  before insert or update on public.blog_posts
  for each row execute function private.blog_posts_antes_de_gravar();

-- Permissões de tabela: o anônimo só lê colunas públicas.
alter table public.blog_posts enable row level security;

revoke all on public.blog_posts from anon, authenticated;
grant select (id, slug, titulo, resumo, conteudo, capa_url, capa_alt, categoria, tags,
              status, publicado_em, autor_nome, atualizado_em)
  on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;

create policy "blog: qualquer um le post publicado"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'publicado' and publicado_em <= now());

create policy "blog: time de conteudo le tudo"
  on public.blog_posts for select
  to authenticated
  using ((select private.tem_area('/conteudo')));

create policy "blog: time de conteudo cria"
  on public.blog_posts for insert
  to authenticated
  with check ((select private.tem_area('/conteudo')));

create policy "blog: time de conteudo edita"
  on public.blog_posts for update
  to authenticated
  using ((select private.tem_area('/conteudo')))
  with check ((select private.tem_area('/conteudo')));

create policy "blog: time de conteudo apaga"
  on public.blog_posts for delete
  to authenticated
  using ((select private.tem_area('/conteudo')));

-- Imagens do blog: bucket público (a página do post carrega a capa direto
-- da URL pública), escrita só para o time de conteúdo. Sem política de
-- leitura para o anônimo: ninguém lista o bucket, só abre o arquivo pela URL.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog', 'blog', true, 5242880, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do nothing;

create policy "blog: time de conteudo envia imagem"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog' and (select private.tem_area('/conteudo')));

create policy "blog: time de conteudo troca imagem"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog' and (select private.tem_area('/conteudo')))
  with check (bucket_id = 'blog' and (select private.tem_area('/conteudo')));

create policy "blog: time de conteudo apaga imagem"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog' and (select private.tem_area('/conteudo')));

create policy "blog: time de conteudo ve as imagens"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'blog' and (select private.tem_area('/conteudo')));
