# Executar, validar e publicar

## Instalação

```sh
git clone https://github.com/valverdentalmalaga-code/site-valver.git
cd site-valver
npm ci
npm run typecheck
npm run build
```

O Vite utilizado exige Node.js 20.19 ou uma versão a partir de 22.12. Os scripts estão em `package.json` e o lockfile é versionado.

## Desenvolvimento

```sh
npm run dev
```

Abra http://127.0.0.1:8791/. O Vite injeta a entrada TypeScript das ilhas no HTML durante o desenvolvimento.

## Prévia da entrega estática

```sh
python3 -m http.server 8790 --bind 127.0.0.1
```

Abra http://127.0.0.1:8790/. A entrega inclui os bundles locais, fontes e imagens; nenhum serviço externo de imagens ou scripts é necessário para renderizar o site.

## Publicação

Sirva a raiz do repositório com `index.html` como entrada. Inclua o HTML, `config.js`, arquivos CSS/JS e `assets/`. Se o provedor executar um build, configure `npm ci && npm run build`.

O Vite compila somente as ilhas React em `assets/runtime/`. Essa pasta não representa o site completo; não configure o diretório de publicação como `assets/runtime` ou `dist`.

Fazer push no GitHub não configura automaticamente um domínio, GitHub Pages ou outra hospedagem. A publicação precisa ser configurada no provedor escolhido. Nunca envie `node_modules`, `.env`, logs ou caches.

## Checklist funcional

- Conferir navegação, menu móvel, teclado e fechamento dos diálogos com Escape.
- Conferir os seis tratamentos sem prender o scroll da página.
- Conferir fachada fixa acima da galeria; três fotos dos interiores no desktop e uma no celular.
- Conferir destinos do WhatsApp, Instagram, e-mail e mapa, sem enviar mensagens durante o teste.
- Conferir telas pequenas, ausência de rolagem lateral e `prefers-reduced-motion`.
- Confirmar que a seção de avaliações fictícias continua removida.

## Contato e conteúdo

Os contatos públicos ficam em `config.js`; o telefone visual, e-mail e links explícitos também aparecem no HTML. Atualize ambos ao mudar os dados. `bookingUrl` está vazio: não existe confirmação automática de agenda.

Use fotografias autorizadas pelo responsável. As fotos da pasta de instalações foram fornecidas para esta seção; as imagens ilustrativas de outras partes têm origem documentada em `assets/ASSETS.md`.
