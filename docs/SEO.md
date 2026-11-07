# Indexação e SEO local

## Arquivos publicados

- `https://valverdental.com/robots.txt`: permite rastrear o site, incluindo CSS, JavaScript e imagens, e anuncia o sitemap.
- `https://valverdental.com/sitemap.xml`: lista somente a URL canônica da página única e seis fotografias fornecidas da clínica.
- `index.html`: título e descrição localizados para Málaga, canonical HTTPS, metadados Open Graph/Twitter e JSON-LD com `Dentist`, `WebSite` e `WebPage`.
- `design-system.html`: marcado com `noindex, follow`, para que o guia de desenvolvimento não concorra com o site institucional.
- `googleee3badde9be8f6cd.html`: arquivo do Search Console preservado sem alterações.

As âncoras das seções não são páginas distintas e não entram no sitemap. Não foram criadas URLs sem conteúdo, prioridades artificiais, palavras-chave ocultas, avaliações, notas, horários ou coordenadas sem confirmação. O JSON-LD usa somente nome, endereço, contatos, Instagram e imagens fornecidos.

## Google Search Console

1. Verifique a propriedade de prefixo `https://valverdental.com/` com o arquivo já publicado.
2. Em **Sitemaps**, envie `sitemap.xml`.
3. Use a inspeção de URL na página inicial para conferir o rastreamento e solicitar indexação quando disponível.
4. Acompanhe os relatórios de indexação e desempenho. Não é necessário reenviar o sitemap a cada atualização da página.

O sitemap já é anunciado em `robots.txt`. O envio no painel exige uma sessão autorizada do Search Console; publicar esses arquivos não confirma que o envio foi realizado na conta Google.

## Manutenção

Atualize `lastmod` somente quando houver uma alteração significativa da página, usando a data real. Inclua apenas URLs canônicas HTTPS que respondem com sucesso. Ao atualizar contatos e endereço, mantenha `config.js`, o HTML visível e o JSON-LD consistentes.

A marcação não inclui avaliações fictícias nem promessa de posicionamento. Os arquivos auxiliam descoberta, rastreamento e compreensão do site; a decisão de indexar e classificar pertence aos buscadores.

## Referências oficiais

- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/appearance/structured-data/local-business
