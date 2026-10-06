-- Desfaz 20261005200000_blog_do_site.sql.
-- ATENÇÃO: apaga todos os posts do blog. As imagens do bucket "blog" precisam
-- ser apagadas antes pelo painel do Supabase (Storage), senão o bucket não sai.

drop policy if exists "blog: time de conteudo ve as imagens" on storage.objects;
drop policy if exists "blog: time de conteudo apaga imagem" on storage.objects;
drop policy if exists "blog: time de conteudo troca imagem" on storage.objects;
drop policy if exists "blog: time de conteudo envia imagem" on storage.objects;
delete from storage.buckets where id = 'blog' and not exists (select 1 from storage.objects where bucket_id = 'blog');

drop table if exists public.blog_posts;
drop function if exists private.blog_posts_antes_de_gravar();
