# Organização da importação

A entrega adiciona 30 commits não vazios ao histórico inicial existente, em dez branches temáticas com três commits próprios cada. O commit original da `main` e seu README foram preservados.

| Branch | Commits próprios | Total acumulado nesta importação | Conteúdo |
| --- | ---: | ---: | --- |
| `01-base-projeto` | 3 | 3 | Dependências, TypeScript, aliases e Vite |
| `02-design-system` | 3 | 6 | Tokens, componentes compartilhados e guia visual |
| `03-marca-tipografia` | 3 | 9 | Logotipo, ícone de WhatsApp e fontes locais com licenças |
| `04-hero` | 3 | 12 | Retrato, recorte, parallax e estilos interativos |
| `05-essencia` | 3 | 15 | Imagens e fundo da seção institucional |
| `06-tratamentos` | 3 | 18 | Artes dos serviços, fotografias e deck de cards |
| `07-instalacoes` | 3 | 21 | Fachada, interiores e slider responsivo |
| `08-pagina-contatos` | 3 | 24 | HTML, layout e canais de contato |
| `09-runtime-acessibilidade` | 3 | 27 | Montagem React, build e módulos anteriores arquivados |
| `10-documentacao-entrega` | 3 | 30 | Origem dos assets, publicação, README e capturas |

As branches são sequenciais: cada uma começa no último commit da anterior. São marcos da importação, não dez features independentes. As etapas intermediárias podem depender dos próximos grupos de arquivos; a `main` contém a versão completa.

Os commits descrevem a importação do estado atual do site. Não foram criados commits vazios, datas retroativas ou alterações fictícias de desenvolvimento. Cada mensagem explica o propósito e enumera os arquivos incluídos. A validação consolidada é feita após a importação completa.

A `main` recebe a entrega por avanço direto, sem sobrescrever o histórico original. Para alterações futuras, crie novas branches a partir dela.
