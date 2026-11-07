# Registro anterior à importação

Documento histórico preservado do diretório de trabalho. Pode descrever versões já substituídas; para o estado atual, consulte o README da raiz.

# Valver Dental — website editorial 4.5

Site em espanhol desenvolvido a partir do briefing, do design system local, do PDF com a marca original e da referência visual fornecida. O conteúdo permanece em HTML semântico, com ilhas React/TypeScript para o parallax da hero e a navegação dos serviços. Os arquivos compilados já estão incluídos e funcionam no Live Server ou em um servidor estático, sem CDN.

## Abrir

Abra `index.html` no Live Server do projeto. Também funciona diretamente no navegador. Para uma prévia HTTP local:

```sh
python3 -m http.server 8790 --bind 127.0.0.1 --directory "/Users/user/Downloads/FlowDetect-main 4/tauri_gerador/web/valver"
```

Acesse **http://127.0.0.1:8790/**. Caso essa porta já esteja ocupada pela prévia, não inicie um segundo servidor.

## Organização

- `index.html`: conteúdo semântico completo, navegação, seis serviços, detalhes nativos, essência, experiência, contato e rodapé.
- `tokens.css` / `components.css`: design system compartilhado, mantido. Cormorant Garamond + Plus Jakarta Sans, oliva, creme e sálvia.
- `site.css`: composição editorial responsiva, fonte manuscrita local, animações e estados de interação.
- `site.js`: navegação móvel por teclado, revelações progressivas, pequenas folhas na transição e contato configurável.
- `components/ui/parallax-scrolling.tsx`: componente React do anexo, adaptado à Valver; controla as quatro velocidades de profundidade e renderiza os ornamentos.
- `components/ui/card-deck-carousel.tsx`: deck manual dos seis tratamentos, com arrasto, controles e detalhes.
- `components/ui/patient-reviews.tsx`: carrossel horizontal de avaliações reais e autorizadas.
- `src/hero.tsx` / `src/hero.css`: montagem das ilhas React e estilos isolados.
- `assets/runtime/hero-parallax.js` / `.css`: versão compilada local, incluída no HTML.
- `components.json`, `tsconfig.json`, `vite.config.ts`: estrutura para componentes shadcn, TypeScript e Tailwind com alias `@/`.
- `config.js`: dados reais da clínica e destinos dos contatos.
- `assets/brand/`: símbolo e lettering extraídos dos vetores originais, sem redesenhar a marca.
- `assets/photos/`: imagens WebP sem textos ou botões embutidos.
- `assets/ASSETS.md`: origem, licença de fontes e prompts das imagens.
- `design-system.html`: guia visual original, preservado.

A versão anterior ao redesign está em `../valver_backup_pre_premium_20261101/`. A versão imediatamente anterior ao parallax está em `../valver_backup_pre_parallax_20261101/`.

## Direção visual

Hero com retrato, título em duas linhas, frase manuscrita e entrada de aproximadamente 1,5 s. A fotografia tem deslocamento discreto com o mouse e scroll. O recorte em arco acompanha a identidade já estabelecida. A mudança para os tratamentos usa borda editorial curva e um deck de fotografias com inclinação discreta.

No desktop com mouse, Lenis suaviza a roda e é sincronizado ao GSAP ScrollTrigger. No toque e com movimento reduzido, a rolagem permanece nativa. A hero mantém altura natural. A área de serviços tem altura natural e navegação manual; o scroll nunca seleciona cards. Não há interceptação de wheel/touch por card nem folha gigante sobre textos. A posição das pequenas folhas deriva do scroll, inclusive na volta; a revelação de conteúdo acontece uma única vez. `prefers-reduced-motion` elimina animações e parallax. Sem JavaScript, o conteúdo e os detalhes de serviço continuam disponíveis.

Os tratamentos usam um deck responsivo com contador, indicadores e botões. “Quiero saber más” abre um diálogo nativo com a informação da especialidade atual. Sem JavaScript, os seis tratamentos continuam disponíveis em grid, com detalhes expansíveis. A seção “Nuestra esencia” apresenta a filosofia de cuidado por inteiro, sem cliques ou expansões e sem datas, números ou credenciais inventados.

## Configurar contato antes de publicar

Preencha `config.js` somente com informações verificadas:

| Campo | Formato |
| --- | --- |
| `bookingUrl` | URL HTTPS da agenda real |
| `whatsapp` | Número internacional, apenas dígitos, com código do país |
| `email` | E-mail da clínica |
| `phone` | Telefone no formato de apresentação |
| `address` | Endereço real em texto |
| `instagramUrl` / `facebookUrl` | URLs HTTPS dos perfis oficiais |

O endereço e o Instagram foram informados pelo usuário e já estão preenchidos. Agenda, WhatsApp, e-mail e telefone permanecem vazios porque não foram fornecidos. A página direciona o contato ao Instagram e abre a localização pelo endereço. Não simula envio, reserva ou confirmação. Assim que configurados, os botões passam a abrir os destinos reais. A escolha de um tratamento é aproveitada na mensagem pré-preenchida do WhatsApp.

Não há backend, coleta de dados pessoais, formulário que armazene informações nem rastreamento de terceiros. A ação de contato só ocorre quando o visitante clica no canal configurado. Endereço e telefone não são inventados. Redes sociais ausentes não aparecem.

## Imagens

O logotipo vem do PDF fornecido. As fotografias são **ilustrações geradas com IA** para esta direção de arte, incluindo o retrato derivado da referência enviada. Não são apresentadas como equipe, instalações, pacientes reais ou resultados da Valver. A documentação de produção está em `assets/ASSETS.md`. Para produção institucional, podem ser substituídas por fotografia própria da clínica.

O painel `treatments.webp` contém seis fotografias sem texto. O CSS utiliza seis enquadramentos independentes da mesma imagem, evitando seis downloads. Toda a tipografia, botões e conteúdo são HTML acessível e editável.

## Validação — 01/11/2026

Revisão visual em Chromium e testes nas larguras 320, 390, 430, 768, 1024, 1440 e 1920 px:

- Sem overflow horizontal ou erros JavaScript/requisições de assets.
- Menu mobile, Escape, retorno de foco e navegação por âncoras.
- Expansão das seis especialidades e texto institucional.
- Diálogo de contato sem configuração, fechamento e retorno de foco.
- Destino de agendamento configurado testado com URL interceptada localmente, sem contatar serviço externo.
- Rejeição de esquemas inseguros em URLs de configuração.
- Conteúdo utilizável sem JavaScript e com movimento reduzido.
- Fontes e imagens locais; versões menores dos retratos em celulares.

Ainda é necessária a conferência em aparelhos físicos e Safari/iOS antes da publicação. Não foi publicada uma nova versão remota nesta entrega.

## Integração do parallax — 4.1

Base: componente React enviado no anexo `parallax-scrolling.tsx`, com padrão de camadas atribuído a [Osmo](https://www.osmo.supply/). A composição da Valver utiliza a fotografia, o logotipo original e os tokens existentes, em vez das imagens de paisagem do exemplo.

Skills aplicadas: `emil-design-eng`, `animate` e `mobile-native`. Propósito: profundidade e continuidade visual em uma abertura de marketing, com interação ocasional. O parallax usa `transform`, progressão linear vinculada ao scroll e compensação de 350 ms no desktop. O movimento do cursor usa a curva já existente em `--v-ease`, com 500 ms de resposta interrompível.

As velocidades mantêm a relação 70/55/40/10 do exemplo, multiplicada por `strength=0.18`. Em telas estreitas ou ponteiro de toque, a amplitude cai para 38% e o texto fica imóvel. A fotografia, o texto, o plano de fundo e o primeiro plano possuem movimento independente. Ao inverter o scroll, não há acúmulo de deslocamento.

### Desenvolvimento

A pasta raiz desta integração é `tauri_gerador/web/valver`. Os componentes reutilizáveis ficam em `components/ui`, no padrão do shadcn, para separar componentes e facilitar imports via `@/components/ui/...`. A hero não precisa de providers de estado; apenas referências DOM e efeitos de ciclo de vida.

```sh
cd "/Users/user/Downloads/FlowDetect-main 4/tauri_gerador/web/valver"
npm ci
npm run dev
```

A prévia com atualização do código fica em **http://127.0.0.1:8791/**. Para atualizar os arquivos que o Live Server, o servidor estático e o HTML local utilizam:

```sh
npm run build
```

O build verifica os tipos e gera apenas `assets/runtime/hero-parallax.js` e `hero-parallax.css`. `npm run typecheck` faz a checagem de TypeScript separadamente. O `package-lock.json` fixa as versões das dependências. Não publique `node_modules/` nem `.vite/`; o ZIP entregue já exclui essas pastas.

Tailwind está instalado com prefixo `tw:` e sem Preflight global, preservando o design system. A configuração manual do shadcn está em `components.json`, com `cn()` em `lib/utils.ts`. O componente deste anexo não depende de componentes shadcn adicionais, ícones externos ou imagens remotas. Para futuros componentes, execute o CLI nessa mesma pasta e revise a saída para manter os tokens da Valver.

Foi usado o pacote atual `lenis`, sucessor de `@studio-freight/lenis`. Os procedimentos de sincronização e limpeza seguem a [documentação oficial do Lenis](https://github.com/darkroomengineering/lenis) e o [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). O cleanup remove apenas os efeitos desta hero; não usa `ScrollTrigger.getAll().kill()` e não deixa callbacks do Lenis no ticker.

O HTML mantém o conteúdo e a imagem antes da montagem do React e se JavaScript falhar. A ilha é montada em `#hero-parallax-root`. Para removê-la em um host que substitua a página, dispare `valver:unmount` nesse elemento. O modo de desenvolvimento também limpa a montagem anterior durante atualizações.

Verificações da integração: build e tipos, scroll de ida e volta, reset da posição, diferentes larguras, menu mobile, mudança de movimento reduzido em tempo real, unmount, ausência de overflow e carregamento via servidor estático, Vite e arquivo local. As medidas no celular foram conferidas por emulação; sensação do gesto e Safari/iOS ainda requerem aparelho físico.

## Serviços em deck — 4.2

Integração do `card-deck-carousel.tsx` enviado pelo usuário, adaptado à navegação dos seis serviços existentes. As imagens, títulos e descrições vêm dos cards HTML originais; não há paisagens genéricas, autoplay ou ciclo infinito. O componente está em `components/ui/card-deck-carousel.tsx`, na estrutura React/TypeScript/Tailwind já configurada. Nenhuma nova dependência foi necessária.

### Como navegar

- **Scroll:** movimenta somente a página. O visitante pode descer diretamente, sem percorrer os seis cards. Ao voltar à seção, o tratamento selecionado é preservado.
- **Setas e indicadores:** permitem avançar, voltar ou escolher diretamente um tratamento. O contador permanece no mesmo lugar. O primeiro não permite voltar além do início.
- **Último card:** a seta muda para “Continuar ↓” e leva à seção seguinte. O arrasto de avanço no último card também continua o site.
- **Arrasto:** para a esquerda avança e para a direita volta. O gesto vertical continua rolando a página. Cancelamento e múltiplos ponteiros não descartam o card indevidamente.
- **Teclado:** a área de cards recebe foco; setas esquerda/direita navegam, Home e End selecionam o primeiro/último. Avançar além do sexto transfere o foco para a próxima seção. As trocas por teclado são imediatas.
- **Detalhes:** “Quiero saber más” abre um diálogo com título e conteúdo específicos. Escape fecha e devolve o foco. O CTA aproveita o interesse no tratamento ao seguir para contato.

### Responsividade e acessibilidade

O deck usa navegação manual em todas as resoluções, com altura baseada apenas no conteúdo. Não há fixação da seção, distância adicional de rolagem ou seleção de card associada à posição da página. O botão “Continuar” permanece no último card como ação opcional.

As alterações de card usam somente transform e opacidade, com transição de 280 ms baseada na curva do design system. O arrasto atualiza diretamente a transformação, sem renderizar o React a cada movimento do ponteiro. Há contador anunciado por leitor de tela, estados de foco, controles visíveis, hover condicionado a mouse e preferência de movimento reduzido.

Os links de serviços do rodapé e URLs diretas como `#tratamiento-cirugia` continuam selecionando o tratamento correspondente. A implementação preserva os cards HTML como fonte de conteúdo e fallback sem JavaScript. Ao desmontar a ilha React, o grid original volta a aparecer.

### Verificação da entrega

- Build de produção e tipos aprovados.
- Seis tratamentos, detalhes e passagem final conferidos em 320, 390 e 1440 px.
- Scroll de ida/volta, setas, indicadores, teclado, arrasto, foco e Escape.
- Liberação da seção ao terminar a sequência; nenhum loop de volta ao primeiro.
- Links do rodapé, movimento reduzido, desmontagem e fallback sem JavaScript.
- Layout também conferido em 768 px e em 844 × 390, onde a passagem fica manual.
- Sem overflow horizontal ou erros JavaScript nos cenários verificados.

O toque foi validado por eventos em navegador emulado; a sensação do gesto em aparelhos físicos ainda deve ser conferida antes de publicar.

## Correção da legenda da hero — 4.2.1

Mensagem manuscrita com largura e respiro próprios, entrada por opacidade e enquadramento responsivo. Foto e legenda compartilham a mesma camada de parallax. O contorno decorativo que atravessava a mensagem foi removido. Conferido em 320, 390, 768 e 1440 px.

## Navegação manual dos serviços — 4.2.2

Removidos os cálculos de progresso, listeners de scroll e fixação da seção. Cards só mudam por arrasto, setas, teclado ou indicadores explícitos. A seleção permanece ao descer e voltar. A troca de card não desloca a página. Conferido em 390 e 1440 px, incluindo continuação opcional após o sexto card.

## Estrutura de seis dobras — 4.3

Ordem atual do site:

1. Hero — “Tu sonrisa, en buenas manos.”
2. Institucional — “Más que sonrisas, cuidamos personas.”; reúne essência e “Un espacio pensado para ti”.
3. Tratamentos — seis serviços no deck manual, com scroll livre.
4. Avaliações — “Sonrisas que cuentan historias.”
5. Diferenciais — atendimento próximo, cuidado personalizado e conforto.
6. Agendamento e contato — endereço, mapa e Instagram; seguido do footer.

O título institucional revela palavras em sequência ao entrar na tela; a imagem tem revelação e zoom discretos. O menu inclui Opiniones. O último card de serviço permite continuar para a seção seguinte, sem alterar a navegação manual solicitada.

### Informações fornecidas pelo usuário

- Endereço: Calle Omar, 14, 29004 Málaga.
- Instagram: https://www.instagram.com/valverdental_/
- A rota abre uma busca pelo endereço no Google Maps; não é apresentada como perfil comercial verificado.
- Sem telefone ou WhatsApp informados, o contato disponível é pelo Instagram. O botão de agendamento abre os canais disponíveis, sem simular uma reserva.

### Avaliações autênticas

`config.js` contém `reviews: []`. As avaliações reais ainda não foram fornecidas. A versão 4.4 acrescenta exemplos fictícios, claramente identificados e mantidos separados das avaliações reais. Quando existirem avaliações reais com autorização para republicação, preencher a lista com os campos `author`, `text`, `authorized: true` e, opcionalmente, `rating` (inteiro de 1 a 5), `date`, `sourceName`, `sourceUrl` (HTTPS). Somente entradas autorizadas com texto e autoria preenchidos são exibidas. A fonte não é inferida como Google; precisa ser informada corretamente.

O carrossel usa rolagem horizontal nativa, scroll-snap, setas e teclado. Não há autoplay. Não há busca automática ou cópia de avaliações de outras fontes. Os dados sintéticos usados na validação foram injetados somente na sessão de teste e não fazem parte da configuração entregue.

### Foto institucional

Como ainda não há fotografia real da clínica, permanece a imagem ilustrativa já utilizada, agora identificada também na legenda visível. Para substituir por uma foto própria, definir `clinicPhoto` e `clinicPhotoAlt` em `config.js`. A fotografia ilustrativa não é apresentada como registro da clínica real.

### Verificação

Tipos/build aprovados. Ordem das seis seções, responsividade em 320/390/768/1440 px, serviços manuais, continuidade após o último card, endereço, Instagram e diálogo de agendamento conferidos. Carrossel e filtro de avaliações autorizadas testados com dados isolados. Sem erros JavaScript ou overflow horizontal nos cenários verificados.

## Cards e sequência mobile — 4.3.1

Cards de tratamento em proporção 1:1. Cada fotografia mantém o recorte quadrado completo do painel, ajustado por inteiro à área disponível, sem zoom ou corte adicional. Na seção institucional, o texto vem antes da imagem tanto no HTML quanto na versão mobile; no desktop, a foto continua na coluna esquerda. Conferido em 320, 390 e 1440 px, com navegação manual preservada.

## Avaliações em faixas — 4.4

Integração da referência `marquee-01.tsx`, com Card/CardContent em `components/ui/card.tsx` e utilitário em `components/ui/marquee-01-utils/marquee.tsx`. Os seis exemplos de texto curto estão em `data/demo-reviews.ts`, com nomes fictícios e retratos sintéticos locais. A criação foi solicitada para compor a apresentação visual; não são depoimentos autênticos.

- Aviso geral visível: “Vista de diseño · nombres, retratos y mensajes ficticios.”
- Cada card é identificado como “Ejemplo ficticio”; não há estrelas ou fonte Google para os exemplos.
- `showDemoReviews: true` habilita a demonstração. Definir `false` restaura a apresentação editorial sem relatos.
- Se `reviews` tiver avaliações reais e autorizadas, elas substituem automaticamente todos os exemplos. Fotografias reais opcionais usam `avatarUrl` e também devem ter autorização para publicação.
- No desktop, duas faixas suaves em sentidos opostos (44/52 s), com pausa por hover, foco ou botão.
- No toque e com movimento reduzido, as faixas ficam estáticas e permitem deslizar horizontalmente.
- As cópias visuais da animação são ocultas de tecnologias assistivas e não recebem foco.
- Textos completos, sem truncamento; imagens locais, sem requisição a bancos de fotografia.

Origem e prompt dos retratos: `assets/REVIEW-DEMO.md`. Build/tipos aprovados, exemplos e rótulos conferidos em 320/390/1440 px, pausa/retomada, swipe no toque e movimento reduzido. Verificada também a prioridade dos dados reais autorizados em uma sessão isolada de teste.

## Avanço automático dos tratamentos — 4.4.1

Os cards agora avançam sozinhos depois de um intervalo de leitura (mínimo de 7 s, ajustado ao tamanho do texto até 10,5 s). A rolagem da página continua independente e o card selecionado permanece quando o visitante sai e volta.

O temporizador só funciona quando o texto está suficientemente visível, a aba está ativa e não há menu ou diálogo aberto. Pausa durante arrasto, hover de leitura, foco de teclado ou pelo botão Pausar. A preferência de movimento reduzido mantém navegação manual. Ao interagir, o intervalo de leitura recomeça por inteiro.

A troca automática usa uma transição de 600 ms; ações manuais continuam rápidas. No sexto card o avanço automático termina, sem repetir a sequência ou deslocar a página. “Continuar” segue disponível como ação explícita. O prop `autoplay={0}` desativa a função no componente.

## Nuestra esencia — 4.5

Fundo inspirado no `great-ui-diagonal-marquee-carousel.tsx` enviado pelo usuário (Great UI / Saurabh Sharma, MIT), adaptado com imagens locais da Valver, ângulo de −14°, três faixas lentas e opacidade discreta. O código mantém o crédito da referência. O fundo é decorativo, oculto de leitores de tela e não intercepta cliques. A animação é pausada apenas fora da tela; passar o mouse não interrompe o movimento; no mobile e com movimento reduzido permanece estática.

A história foi reescrita como uma apresentação da filosofia de cuidado, sem inventar fundação, datas ou credenciais. Todo o conteúdo está em HTML aberto: escuta, explicações claras, decisões tranquilas e acompanhamento próximo. Removido o botão “Conoce nuestra historia” e todo o bloco expansível. Fecho: “Tu historia. Tu ritmo. Tu sonrisa.”

O texto continua antes da imagem no mobile. A fotografia permanece ilustrativa e identificada como tal. A substituição por foto real segue disponível em `config.js`. Conferidos 320, 390 e 1440 px, sem overflow, além de movimento reduzido e conteúdo completo sem JavaScript. Build e tipos aprovados.

## Fundo ampliado — 4.5.1

Fotos diagonais ampliadas para 300–420 px no desktop e 260 px no mobile. Removida a pausa por hover. O movimento continua discreto, com duração ampliada para manter uma velocidade tranquila. Conferidos hover, progressão da animação e ausência de overflow em 1440/390 px.

## Novas imagens do fundo — 4.6

Substituído o conjunto de imagens do fundo por 18 cenas ilustrativas novas de atendimento odontológico, distribuídas em três faixas de seis cenas distintas. Incluem revisão, limpeza, escaneamento intraoral, aparelho, alinhador, orientação e conversa com o dentista. Cada cena aparece em apenas uma faixa. A duplicação técnica do grupo mantém o loop contínuo.

As imagens não são registros da Valver ou de pacientes reais. Foram criadas com a ferramenta integrada e otimizadas para três arquivos WebP locais (aproximadamente 400 KB no total). O texto e a fotografia principal permanecem independentes. Origem e prompts em `assets/ESSENCE-PROCEDURES.md`. Conferidos 390, 1440 e 1920 px, com 18 enquadramentos únicos, continuidade das faixas, build/tipos e ausência de overflow ou erros de assets.

## Movimento contínuo — 4.6.1

Removidos os botões Pausar/Reanudar dos tratamentos e das avaliações. O hover não interrompe as faixas de avaliações nem o avanço automático dos serviços. Permanecem as proteções de movimento reduzido, leitura com foco de teclado, arrasto, diálogos e aba inativa. O sexto tratamento continua sem avançar a página automaticamente.

## Rótulos simplificados — 4.6.2

Removidos os rótulos de exemplo dos cards de demonstração. Permanece uma identificação única e visível na seção: “Contenido de demostración: nombres, retratos y mensajes creados para este diseño.” Os exemplos continuam separados de avaliações reais autorizadas.

## Estrelas em destaque — 4.6.3

Os seis cards de demonstração exibem notas individuais alternadas entre 4 e 5, com estrelas SVG maiores em dourado discreto e valor numérico. As notas também fazem parte do conteúdo demonstrativo identificado na seção; não representam notas reais nem uma média da clínica. Avaliações autorizadas futuras mantêm suas próprias notas, sem alteração para 4 ou 5.

## Estrelas discretas — 4.6.4

Notas mantidas, com estrelas pequenas em sálvia logo abaixo do nome, sem valor numérico em destaque. A identificação geral de conteúdo demonstrativo permanece na seção. Build e tipos aprovados.

## Essência resumida — 4.6.5

A seção passa a destacar “Tu historia. Tu ritmo. Tu sonrisa.” como título principal. Os parágrafos extensos foram substituídos por uma única frase de apoio: “Te escuchamos y te acompañamos con un cuidado cercano, pensado para ti.” Todo o conteúdo permanece aberto, com o fundo e a ordem mobile preservados.

## Restauração da essência — 4.6.6

Desfeita a simplificação da versão 4.6.5, conforme solicitado. Restaurados “Más que sonrisas, cuidamos personas.”, os parágrafos anteriores e o fecho manuscrito “Tu historia. Tu ritmo. Tu sonrisa.”.

## Trecho institucional mais curto — 4.6.7

O título extenso e os dois primeiros parágrafos foram resumidos para “Cuidamos de ti.” e “Te escuchamos y te explicamos cada opción con claridad, para que decidas con tranquilidad.”. Preservados o bloco “Un espacio para sentirte tú.” e o fecho manuscrito “Tu historia. Tu ritmo. Tu sonrisa.”.

### 4.7.2 — Olivas e janela da hero
Arco original preservado, pequenos ramos vetoriais na borda externa direita e retrato com cabelo além do topo. Elementos decorativos agrupados com a foto, sem atravessar o texto.

### 4.7.3 — Ramos de oliva
Folhas lanceoladas com tons de sálvia, nervuras finas e pequenas olivas; posição mantida junto à moldura sem sobrepor o texto.

### 4.7.4 — Folhagem da marca
Ramos detalhados com frutos substituídos pelas folhas largas do motivo botânico já usado no contato, com cores suaves junto à janela da hero.

### 4.7.5 — Ramo acompanhando o arco
Caule curvo e folhas orientadas pela tangente do ramo, acompanhando o contorno superior direito da janela no desktop e no celular.

### 4.7.6 — Alinhamento do ramo
Caule acompanha o raio real da janela, com afastamento constante de 5px e ajuste automático ao redimensionar. Validado em 320, 390, 768 e 1440px.

### 4.7.8 — WhatsApp flutuante
Botão fixo no canto inferior direito, adaptado a celular e áreas seguras. Usa `whatsapp` de `config.js` (código do país + número, somente dígitos); enquanto vazio, abre diálogo informando a indisponibilidade e oferecendo os canais cadastrados. Oculto durante menu e diálogo.

### 4.7.9 — WhatsApp conectado
Número confirmado pelo usuário: +34 604 97 00 85. Botão flutuante e contato abrem conversa com mensagem inicial em espanhol.

### 4.7.10 — WhatsApp com brilho
Botão de 100px no desktop e 80px no celular, ícone verde luminoso e fundo escuro translúcido com halo suave.

### 4.7.13 — Ramo da referência
Folhas largas em pares no canto inferior direito do retrato; arco da janela preservado e ramo superior removido.
