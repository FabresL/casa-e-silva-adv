# Casa & Silva Advocacia — site estático

HTML, CSS e JavaScript puros. Sem npm, sem build.

## Ver no computador
Abra um servidor local na pasta (qualquer um):
```bash
python3 -m http.server 8000     # depois acesse http://localhost:8000
```
Ou use a extensão "Live Server" do VS Code.

## Publicar no GitHub Pages
1. Crie um repositório e envie **o conteúdo desta pasta** (o `index.html` deve ficar na raiz).
2. No repositório: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.
3. O site abre em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` (todos os caminhos são relativos, então funciona em subpasta).

## Ativar o envio do formulário (EmailJS)
Sem isso o formulário mostra erro e oferece WhatsApp/e-mail (nunca finge sucesso).
1. Em emailjs.com, conecte o Gmail `leocasaadv@gmail.com` em **Email Services** → copie o **Service ID**.
2. Crie um **Email Template**: To = `leocasaadv@gmail.com`, Reply-To = `{{email_visitante}}`, Subject = `{{assunto}}`, Content = `{{corpo_email}}` → copie o **Template ID**.
3. Em **Account → General**, copie a **Public Key**.
4. Preencha `js/config.js` (são chaves públicas) e, no EmailJS, restrinja o uso ao domínio do GitHub Pages.

## Google Maps (opcional)
Sem chave, o mapa usa iframe. Para usar a API: ative Maps JavaScript API e Geocoding API, crie uma chave restrita ao domínio e preencha `googleMapsKey` em `js/config.js`.

## Revisão antes de publicar
O texto da Política de Privacidade (modal) deve ser revisado pelo advogado responsável.
