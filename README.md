# Peixoto David Arquitetura — Site Institucional

Site institucional de página única da **Peixoto David Arquitetura**, escritório
especializado em **As Built**, **Plantas de Contrato**, **Manual do Proprietário**
e **Compatibilização de Projetos** para construtoras e incorporadoras.

Aplicação **Flask** que serve uma landing page estática (HTML + CSS + JS puro),
sem etapa de build de front-end.

## Stack

- **Backend:** Flask (Python)
- **Servidor de produção:** Gunicorn (via `Procfile`)
- **Front-end:** HTML (Jinja2) + CSS puro + JavaScript vanilla
- **Fontes:** Cormorant Garamond + Inter (Google Fonts)

## Estrutura

```
app.py                  # entrypoint usado pelo gunicorn (app:app)
flask_app.py            # entrypoint de desenvolvimento (debug)
Procfile                # web: gunicorn app:app
requirements.txt        # dependências Python
templates/
  index.html            # página única (Hero, Quem Somos, Serviços,
                        #   Diferenciais, Parcerias, Contato, Footer)
static/
  css/brand.css         # estilos do site
  js/brand.js           # animações de scroll, contadores, parallax,
                        #   menu mobile, vídeos e formulário
  images/               # imagens e vídeos do site
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

## Deploy

O deploy permanece idêntico ao anterior: o `Procfile` sobe a aplicação com
`gunicorn app:app`. Nenhuma etapa de build adicional é necessária.

## Notas sobre conteúdo

- As imagens dos sócios e os logos das empresas parceiras usam placeholders
  (iniciais e wordmarks). Basta substituir pelos arquivos definitivos em
  `static/images/` e atualizar as referências em `templates/index.html`.
- A seção "Nosso trabalho" reaproveita os vídeos em `static/images/`
  (autoplay, mudo, em loop, com filtro preto e branco).
- O formulário de contato encaminha a mensagem via WhatsApp.
