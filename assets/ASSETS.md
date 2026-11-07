# Valver Dental — assets et provenance

## Marca

- `brand/valver-logo.svg`, `valver-wordmark.svg` e `valver-symbol.svg`: extraídos dos vetores do PDF fornecido pelo usuário, `Logo vectorizado - valver dental.pdf`. Desenho e cor originais preservados; apenas a área de visualização foi ajustada.
- Referência de direção de arte: `Valver Dental_ Sonrisas en buenas manos.png`, fornecida pelo usuário. Os textos e controles da página estão em HTML, não nas imagens.

## Fotografia ilustrativa

As imagens em `photos/` foram preparadas com a ferramenta integrada de geração de imagem. São ilustrações fotográficas de marca; **não representam pacientes, profissionais, instalações ou resultados reais da clínica**. Substituir por fotografias próprias verificadas quando disponíveis. Não utilizá-las como depoimentos ou antes/depois.

- `hero.webp`: retrato derivado da referência enviada; versões 1122 e 680 pixels de largura.
- `care.webp`: cena ilustrativa de escuta em consulta; versões 1122 e 680 pixels de largura.
- `treatments.webp`: painel fotográfico de seis especialidades, sem texto, exibido em seis recortes CSS independentes. Original 1536 × 1024. Um único download, seis enquadramentos. As imagens clínicas são ilustrativas, não diagramas para orientação clínica.
- Originais preservados em `/Users/user/.codex/generated_images/01a0dff9-7703-7ae1-b414-da1197086a96/`.
- WebP codificado a qualidade 88 (miniaturas 85). Nenhuma chamada externa é necessária para exibir as imagens.
- Os antigos PNGs em `servicos/` foram preservados, mas não são utilizados na página nova.

## Fontes

- Cormorant Garamond e Plus Jakarta Sans: arquivos locais já presentes no design system; respectivas licenças OFL em `fonts/`.
- Caveat: manuscrita usada apenas na frase emocional. Subconjunto latino WOFF2 otimizado a partir do arquivo original, preservado em `fonts/caveat.ttf`. Arquivo obtido do repositório oficial Google Fonts: https://github.com/google/fonts/tree/main/ofl/caveat . Licença SIL OFL incluída em `fonts/caveat-OFL.txt`.

## Prompts de produção — ferramenta integrada

### Hero

Use case: identity-preserve. Asset type: editorial website photograph for Valver Dental. Input image is an EDIT TARGET/reference layout. Extract and recreate ONLY the smiling brunette woman in the top hero of the reference, keeping her warm authentic smile, appearance, hand touching cheek, cream knitted sweater and softly lit beige interior. Deliver one high-resolution portrait photograph 4:5, framed from top of head to chest, with breathing room above head, face centered slightly to the right. Natural skin texture, subtle natural window light, cinematic warm ivory and muted olive palette. Soft out-of-focus olive leaves at far edges only. REMOVE ALL typography, logos, buttons, UI, graphic leaf silhouettes and all six service panels. This output is solely the clean photograph to be composed with HTML. No text, no watermark, no collage, no extra people. Do not generate a website screenshot.

### Tratamentos

Create a premium dental editorial photography contact sheet, EXACT 3 columns by 2 rows, six equal square photographs, tightly tiled edge to edge, no gutters, no margins. Landscape overall aspect ratio 3:2. Each square is an independent closeup still life/photograph, absolutely NO TEXT, LETTERING, NUMBERS, GRAPHIC ICONS OR WATERMARKS. Same refined warm ivory, muted olive, soft window lighting across all six. Top left: polished dental mirror and delicate metal instruments resting on a cream clinical tray with soft out of focus olive foliage, no people. Top center: close-up cropped natural smile with neat metal braces, warm skin, mouth centered, no full head. Top right: beautiful smiling mouth and a dental shade guide next to teeth held by a gloved hand. Bottom left: tasteful educational anatomical dental model with natural white teeth and pink gums, a small dental mirror, ivory background. Bottom center: gloved hand holding dental extraction forceps with a white molar model, tasteful nonbloody dental teaching still life. Bottom right: elegant ceramic dental crown above a titanium implant and adjacent anatomical model teeth, ivory background. Clinical accuracy, restrained clean aesthetic, photographic realistic materials, moderate depth of field, objects centered with generous breathing room within each square. Only imagery; these will be composed with HTML titles separately. Render large enough to use each tile as a website card.

### Essência

Photorealistic editorial image for a warm premium dental care website, vertical 4:5 photograph. A female adult dentist in ivory clinical scrubs on left and a female adult patient in a beige blouse on right in a quiet consultation, both in profile facing one another, a natural reassuring smile, eye contact and attentive listening, no staged exaggerated gestures. Mid shot, comfortable contemporary ivory dental room with warm natural window light, subtle olive plant in background, pale wood, soft linen tones. Realistic natural skin texture, authentic varied features. Focus is human attention, not equipment or a procedure. Tasteful understated luxury lifestyle photography, no text, no logos, no watermarks, no infographic. Compose both faces within center 75 percent so image can crop to square or portrait. This is illustrative brand imagery, not a depiction of actual staff.

## Hero com recorte transparente
`hero-cutout.webp` e `hero-cutout-small.webp`: edição do retrato ilustrativo original com fundo removido e canal alfa preservado, usada sobre a janela em arco. Ramos minimalistas em SVG no HTML.

## Nuestras instalaciones · 4.8.0
Fotografia da fachada fornecida pelo responsável em `WhatsApp Image 2026-11-07 at 15.54.07.jpeg`. Incluída em `photos/instalaciones.webp` e variante de 720px, com o enquadramento integral preservado. Não é uma imagem gerada.

### Atualização 4.8.1
Foto da fachada substituída pelo arquivo fornecido `fotro-faichada.jpeg` (1086 × 1448). Variantes `instalaciones-fachada.webp` e `instalaciones-fachada-small.webp`; proporção integral preservada.

## Galeria Nuestras instalaciones · 4.9.0

Fotografias fornecidas na pasta `Downloads/Imagens-Valver`, preservando enquadramento, cores e proporção na conversão para WebP. Cada foto tem uma versão de até 900px e outra de 480px em `photos/instalaciones/`.

| Arquivo no site | Fonte fornecida |
| --- | --- |
| `fachada` | `fotro-faichada.jpeg` |
| `sala-espera` | `WhatsApp Image 2026-11-07 at 16.04.48.jpeg` |
| `gabinete` | `WhatsApp Image 2026-11-07 at 16.07.30.jpeg` |
| `atencion` | `WhatsApp Image 2026-11-07 at 15.48.56.jpeg` |
| `despacho` | `WhatsApp Image 2026-11-07 at 16.11.16.jpeg` |
| `pasillo` | `WhatsApp Image 2026-11-07 at 16.10.37.jpeg` |

As legendas descrevem os ambientes observados nas imagens. A galeria não usa imagens de bancos externos nem transforma a fotografia do atendimento em avaliação ou depoimento.
