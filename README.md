# Peixoto David Arquitetura — Site Institucional

Site institucional de página única da **Peixoto David Arquitetura**, escritório
especializado em **As Built**, **Plantas de Contrato**, **Manual do Proprietário**
e **Compatibilização de Projetos** para construtoras e incorporadoras.

Aplicação **Flask** que serve uma landing page estática (HTML + CSS + JS puro),
sem etapa de build de front-end.

## Stack

- **Desenvolvimento:** Flask (Python) + Jinja2 para montar o HTML
- **Produção:** site estático exportado no deploy → **Firebase Hosting** (CDN, sem cold start)
- **Front-end:** HTML + CSS puro + JavaScript vanilla
- **Fontes:** Cormorant Garamond + Inter (Google Fonts)

## Estrutura

```
app.py                  # Flask app (dev + export estático)
flask_app.py            # entrypoint de desenvolvimento (debug)
scripts/
  export_static.py      # gera dist/ para Firebase Hosting
firebase.json           # configuração do Firebase Hosting
Procfile                # legado Render (opcional)
requirements.txt        # dependências Python
templates/
  index.html            # página única (Hero, Quem Somos, Serviços,
                        #   Diferenciais, Parcerias, Contato, Footer)
static/
  css/brand.css         # estilos do site
  js/brand.js           # animações de scroll, contadores, parallax,
                        #   menu mobile, vídeos e formulário
  images/               # imagens e vídeos do site
dist/                   # gerado pelo export (não commitar)
```

## Como rodar localmente

Instale as dependências:

```
pip install -r requirements.txt
```

Modo desenvolvimento (auto-reload):

```
python flask_app.py
```

Ou simulando produção:

```
python app.py
```

Acesse http://localhost:5000.

### Pré-visualizar o build estático

```
python scripts/export_static.py
npx firebase-tools serve
```

(Ou `firebase serve` se tiver o CLI instalado globalmente.)

## Deploy — Firebase Hosting (Spark, gratuito)

O site é exportado como HTML estático no CI e publicado na CDN do Firebase —
sem cold start e com domínio customizado no plano gratuito.

### Setup inicial (uma vez)

1. Crie um projeto em [Firebase Console](https://console.firebase.google.com/)
2. Ative **Hosting** no projeto
3. Instale o CLI e faça login:

   ```
   npm install -g firebase-tools
   firebase login
   ```

4. Copie o ID do projeto e crie `.firebaserc` na raiz:

   ```
   cp .firebaserc.example .firebaserc
   ```

   Edite `.firebaserc` e substitua `SEU_PROJECT_ID_AQUI` pelo ID real.

5. Conecte o GitHub ao Firebase (recomendado — configura secrets automaticamente):

   ```
   firebase init hosting:github
   ```

   Escolha o repositório, branch `main`, e confirme a geração do workflow.

   **Ou** configure manualmente no GitHub → Settings → Secrets:

   | Secret | Valor |
   |--------|-------|
   | `FIREBASE_PROJECT_ID` | ID do projeto Firebase |
   | `FIREBASE_SERVICE_ACCOUNT` | JSON da service account (Hosting Admin) |

6. Domínio customizado: Firebase Console → Hosting → **Adicionar domínio customizado**

### Deploy manual (opcional)

```
python scripts/export_static.py
firebase deploy --only hosting
```

### O que acontece no CI

A cada push/PR, o workflow `.github/workflows/firebase-hosting.yml`:

1. Instala dependências Python
2. Roda `scripts/export_static.py` → gera `dist/index.html` + `dist/static/`
3. Publica no Firebase Hosting (live no `main`, preview channel nos PRs)

## Notas sobre conteúdo

- O logo no topo do hero usa a marca em `static/images/logo-pd-blue-mark.png`
  renderizada em branco via filtro CSS, integrada à barra de navegação.
- A seção "Nosso trabalho" reaproveita os vídeos em `static/images/`
  (autoplay, mudo, em loop, com filtro preto e branco).
- O formulário de contato abre o cliente de e-mail do usuário (mailto) com a
  mensagem pré-preenchida endereçada a `peixotodavid.arq@gmail.com`.
- Itens da lista de especialidades no hero direcionam para a seção "Serviços".
