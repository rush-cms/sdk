 1. Homepage API

  GET /api/v1/{site-slug}/homepage

  Retorna o conteúdo da homepage do site.

  Exemplo de Request:
  curl -X GET "https://seudominio.com/api/v1/meu-site/homepage" \
    -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."

  Exemplo de Response (200 OK):
  {
    "data": {
      "id": 1,
      "content": [
        {
          "type": "richtext",
          "data": {
            "content": "<p>Bem-vindo ao nosso site!</p>"
          }
        },
        {
          "type": "image",
          "data": {
            "image": {
              "id": 15,
              "name": "hero-image",
              "file_name": "hero.jpg",
              "mime_type": "image/jpeg",
              "size": 245632,
              "url": "https://seudominio.com/storage/15/hero.jpg",
              "thumb": "https://seudominio.com/storage/15/conversions/hero-thumb.jpg",
              "preview": "https://seudominio.com/storage/15/conversions/hero-preview.jpg"
            },
            "alt": "Imagem principal",
            "caption": "Nossa empresa"
          }
        },
        {
          "type": "gallery",
          "data": {
            "images": [
              {
                "id": 16,
                "name": "gallery-1",
                "file_name": "image1.jpg",
                "mime_type": "image/jpeg",
                "size": 123456,
                "url": "https://seudominio.com/storage/16/image1.jpg",
                "thumb": "https://seudominio.com/storage/16/conversions/image1-thumb.jpg",
                "preview": "https://seudominio.com/storage/16/conversions/image1-preview.jpg"
              },
              {
                "id": 17,
                "name": "gallery-2",
                "file_name": "image2.jpg",
                "mime_type": "image/jpeg",
                "size": 234567,
                "url": "https://seudominio.com/storage/17/image2.jpg",
                "thumb": "https://seudominio.com/storage/17/conversions/image2-thumb.jpg",
                "preview": "https://seudominio.com/storage/17/conversions/image2-preview.jpg"
              }
            ],
            "columns": 3,
            "caption": "Nossa galeria de fotos"
          }
        },
        {
          "type": "custom_hero",
          "data": {
            "title": "Transforme seu negócio",
            "descricao": "Soluções inovadoras para empresas modernas",
            "image": {
              "id": 18,
              "name": "hero-bg",
              "file_name": "background.jpg",
              "mime_type": "image/jpeg",
              "size": 456789,
              "url": "https://seudominio.com/storage/18/background.jpg",
              "thumb": "https://seudominio.com/storage/18/conversions/background-thumb.jpg",
              "preview": "https://seudominio.com/storage/18/conversions/background-preview.jpg"
            }
          }
        },
        {
          "type": "alert",
          "data": {
            "content": "<p>Atenção: Manutenção programada para sábado.</p>",
            "type": "warning"
          }
        },
        {
          "type": "quote",
          "data": {
            "content": "A inovação distingue um líder de um seguidor.",
            "citation": "Steve Jobs"
          }
        },
        {
          "type": "code",
          "data": {
            "code": "npm install rush-cms",
            "language": "bash"
          }
        },
        {
          "type": "youtube",
          "data": {
            "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          }
        },
        {
          "type": "button",
          "data": {
            "label": "Saiba Mais",
            "url": "https://exemplo.com/sobre",
            "style": "primary",
            "target": "_blank"
          }
        },
        {
          "type": "divider",
          "data": {}
        },
        {
          "type": "columns",
          "data": {
            "columns": [
              {
                "content": "<h3>Coluna 1</h3><p>Conteúdo da primeira coluna</p>"
              },
              {
                "content": "<h3>Coluna 2</h3><p>Conteúdo da segunda coluna</p>"
              }
            ]
          }
        },
        {
          "type": "toggle",
          "data": {
            "title": "Clique para expandir",
            "content": "<p>Conteúdo oculto que aparece ao clicar</p>"
          }
        },
        {
          "type": "bookmark",
          "data": {
            "url": "https://exemplo.com/artigo",
            "title": "Artigo Interessante",
            "description": "Descrição do link",
            "image": {
              "id": 19,
              "name": "bookmark-preview",
              "file_name": "preview.jpg",
              "mime_type": "image/jpeg",
              "size": 123456,
              "url": "https://seudominio.com/storage/19/preview.jpg",
              "thumb": "https://seudominio.com/storage/19/conversions/preview-thumb.jpg",
              "preview": "https://seudominio.com/storage/19/conversions/preview-preview.jpg"
            }
          }
        },
        {
          "type": "embed",
          "data": {
            "code": "<iframe src='https://exemplo.com/embed'></iframe>"
          }
        },
        {
          "type": "video",
          "data": {
            "url": "https://exemplo.com/video.mp4",
            "poster": {
              "id": 20,
              "name": "video-poster",
              "file_name": "poster.jpg",
              "mime_type": "image/jpeg",
              "size": 234567,
              "url": "https://seudominio.com/storage/20/poster.jpg",
              "thumb": "https://seudominio.com/storage/20/conversions/poster-thumb.jpg",
              "preview": "https://seudominio.com/storage/20/conversions/poster-preview.jpg"
            }
          }
        }
      ],
      "meta": {
        "title": "Página Inicial - Meu Site",
        "description": "Descrição da homepage para SEO"
      },
      "updated_at": "2025-12-12T22:30:00+00:00"
    }
  }

  Exemplo de Response (404 Not Found):
  {
    "message": "Homepage not found"
  }

  ---
  2. Entries API (com Blocos Personalizados)

  GET /api/v1/{site-slug}/collections/{collection-slug}/entries/{entry-slug}

  Retorna um entry específico que pode conter blocos personalizados.

  Exemplo de Request:
  curl -X GET "https://seudominio.com/api/v1/meu-site/collections/blog/entries/meu-artigo" \
    -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."

  Exemplo de Response (200 OK):
  {
    "data": {
      "id": 42,
      "author": {
        "name": "João Silva"
      },
      "title": "Como usar blocos personalizados",
      "slug": "meu-artigo",
      "excerpt": "Aprenda a criar e usar blocos personalizados no Rush CMS",
      "featured_image": {
        "id": 10,
        "name": "featured",
        "file_name": "capa.jpg",
        "mime_type": "image/jpeg",
        "size": 345678,
        "url": "https://seudominio.com/storage/10/capa.jpg",
        "thumb": "https://seudominio.com/storage/10/conversions/capa-thumb.jpg",
        "preview": "https://seudominio.com/storage/10/conversions/capa-preview.jpg"
      },
      "data": {
        "content": [
          {
            "type": "richtext",
            "data": {
              "content": "<h2>Introdução</h2><p>Este é um exemplo de conteúdo...</p>"
            }
          },
          {
            "type": "custom_hero",
            "data": {
              "title": "Título do Hero Block",
              "descricao": "Descrição detalhada aqui",
              "image": {
                "id": 25,
                "name": "hero-custom",
                "file_name": "hero.jpg",
                "mime_type": "image/jpeg",
                "size": 567890,
                "url": "https://seudominio.com/storage/25/hero.jpg",
                "thumb": "https://seudominio.com/storage/25/conversions/hero-thumb.jpg",
                "preview": "https://seudominio.com/storage/25/conversions/hero-preview.jpg"
              }
            }
          },
          {
            "type": "custom_cta",
            "data": {
              "titulo": "Chamada para Ação",
              "descricao": "Clique aqui e saiba mais",
              "botao_texto": "Começar Agora",
              "botao_url": "https://exemplo.com/comecar",
              "cor_fundo": "#3490dc"
            }
          }
        ]
      },
      "status": "published",
      "published_at": "2025-12-10T15:30:00+00:00",
      "meta": {
        "seo_title": "Como usar blocos personalizados - Blog",
        "seo_description": "Tutorial completo sobre blocos personalizados no Rush CMS"
      },
      "tags": [
        {
          "id": 5,
          "name": "Tutorial",
          "slug": "tutorial"
        },
        {
          "id": 8,
          "name": "CMS",
          "slug": "cms"
        }
      ]
    }
  }

  ---
  3. Listar Entries de uma Collection

  GET /api/v1/{site-slug}/collections/{collection-slug}/entries

  Query Parameters:
  - per_page (opcional, default: 15, max: 100) - Itens por página
  - page (opcional, default: 1) - Número da página
  - tags (opcional) - Filtrar por tags (vírgula separada ou array)
  - tag_operator (opcional, default: 'any') - 'any' ou 'all'

  Exemplo de Request:
  curl -X GET "https://seudominio.com/api/v1/meu-site/collections/blog/entries?per_page=10&page=1&tags=tutorial,cms&tag_operator=all" \
    -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."

  Exemplo de Response:
  {
    "data": [
      {
        "id": 42,
        "author": { "name": "João Silva" },
        "title": "Como usar blocos personalizados",
        "slug": "meu-artigo",
        "excerpt": "Aprenda a criar e usar blocos...",
        "featured_image": { ... },
        "data": { ... },
        "status": "published",
        "published_at": "2025-12-10T15:30:00+00:00",
        "meta": { ... },
        "tags": [ ... ]
      }
    ],
    "links": {
      "first": "https://seudominio.com/api/v1/meu-site/collections/blog/entries?page=1",
      "last": "https://seudominio.com/api/v1/meu-site/collections/blog/entries?page=5",
      "prev": null,
      "next": "https://seudominio.com/api/v1/meu-site/collections/blog/entries?page=2"
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 5,
      "per_page": 10,
      "to": 10,
      "total": 47
    }
  }

  ---
  Tipos de Blocos Disponíveis

  Blocos Nativos:

  1. richtext - Texto rico com HTML
  2. quote - Citações com autor
  3. image - Imagem única com legenda
  4. gallery - Galeria de múltiplas imagens
  5. video - Vídeo com poster
  6. youtube - Embed do YouTube
  7. code - Blocos de código com syntax highlighting
  8. columns - Layout de colunas
  9. button - Botões com links
  10. alert - Caixas de alerta (info/warning/success/error)
  11. divider - Linha divisória
  12. embed - Embed genérico (HTML/iframe)
  13. bookmark - Link com preview
  14. toggle - Conteúdo retrátil/expansível

  Blocos Personalizados:

  - Prefixo custom_ seguido do slug do bloco
  - Exemplo: custom_hero, custom_cta, custom_testimonial
  - Estrutura de dados depende dos campos configurados no admin

  ---
  Transformação de Imagens

  Todas as imagens retornadas pela API incluem 3 URLs:

  - url - Imagem original
  - thumb - Thumbnail (150x150px)
  - preview - Preview (640x480px)

  As conversões são geradas automaticamente pelo Spatie MediaLibrary.

  ---
  Notas Importantes

  1. Autenticação obrigatória: Todas as rotas necessitam do token Bearer
  2. Rate Limiting: As rotas têm limite de requisições configurado
  3. CORS: Configurado para aceitar requisições cross-origin
  4. Status: Apenas entries com status: "published" são retornados
  5. Blocos personalizados: Qualquer campo numérico ou array de números é automaticamente transformado em objetos de mídia
  6. Timezone: Todas as datas estão em UTC no formato ISO 8601