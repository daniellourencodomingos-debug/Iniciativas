# Workflow — do zero ao ar (terminal → GitHub → Vercel → domínio .com.br)

Guia rápido e copiável. Só a etapa de **comprar** o domínio no Registro.br é feita no
site (precisa de CPF/CNPJ e pagamento); todo o resto roda no terminal.

---

## Pré-requisitos (uma vez só)

```bash
node -v            # precisa Node 18+ (o projeto usa 24)
git --version
npm i -g vercel     # CLI da Vercel
# GitHub CLI (opcional, facilita criar o repo)
brew install gh     # macOS
```

Contas necessárias: **GitHub**, **Vercel** (pode logar com o GitHub) e conta no
**Registro.br** (para o domínio).

---

## 1. Projeto local (o que já foi feito)

```bash
mkdir meu-app && cd meu-app
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom
npm run dev            # abre em http://localhost:5173
```

- `tailwind.config.js` → `content: ['./index.html', './src/**/*.{js,jsx}']`
- `src/index.css` → `@tailwind base; @tailwind components; @tailwind utilities;`

Verificação antes de publicar:

```bash
npm run build         # tem que passar sem erro
```

---

## 2. Git local

```bash
git init
git branch -M main
printf "node_modules\ndist\n.vercel\n.DS_Store\n" > .gitignore
git add .
git commit -m "feat: protótipo inicial"
```

---

## 3. GitHub (subir o código)

**Com GitHub CLI (mais rápido):**

```bash
gh auth login                     # uma vez
gh repo create meu-app --private --source=. --remote=origin --push
```

**Sem CLI:** cria o repo vazio em github.com/new, depois:

```bash
git remote add origin git@github.com:SEU_USUARIO/meu-app.git
git push -u origin main
```

Daqui pra frente o ciclo é sempre:

```bash
git add .
git commit -m "descrição da mudança"
git push
```

---

## 4. Vercel (deploy automático)

```bash
vercel login
vercel link           # associa a pasta a um projeto Vercel (cria se não existir)
vercel                # deploy de PREVIEW (URL de teste)
vercel --prod         # deploy de PRODUÇÃO
```

A Vercel detecta Vite sozinha (build `npm run build`, saída `dist`).

**Deploy contínuo:** em vercel.com → *Add New Project* → importa o repo do GitHub.
A partir daí:
- `git push` na branch `main` → deploy de **produção** automático
- `git push` em outra branch / Pull Request → deploy de **preview** automático

Você já tem uma URL: `https://meu-app.vercel.app`.

---

## 5. Comprar o domínio no Registro.br (no site)

1. Acesse **registro.br** → pesquise `meudominio.com.br` → **Registrar**.
2. Entre com sua conta (ID = CPF/CNPJ) e conclua o pagamento (boleto/pix/cartão).
3. O domínio fica ativo em alguns minutos a algumas horas.

> Não dá para comprar por linha de comando — registro e pagamento são só pelo site.
> O que dá para automatizar depois é o **DNS** (passo 6).

---

## 6. Ligar o domínio na Vercel

### 6a. Adicionar o domínio ao projeto

```bash
vercel domains add meudominio.com.br
# ou no dashboard: Project → Settings → Domains → Add
```

A Vercel vai te mostrar os registros DNS que faltam. Normalmente:

| Tipo  | Nome  | Valor                     |
|-------|-------|---------------------------|
| A     | `@`   | `76.76.21.21`             |
| CNAME | `www` | `cname.vercel-dns.com`    |

### 6b. Apontar o DNS no Registro.br

No painel do Registro.br → seu domínio → **Editar Zona / DNS** e cadastre os
registros que a Vercel pediu (o A no `@` e o CNAME no `www`). Salve.

> Alternativa mais simples: em vez de editar a zona, troque os **servidores DNS**
> do domínio no Registro.br para os da Vercel
> (`ns1.vercel-dns.com` / `ns2.vercel-dns.com`). Aí a Vercel gerencia tudo.

### 6c. Esperar e conferir

- Propagação: de minutos até ~24h.
- A Vercel emite o **certificado HTTPS** sozinha quando o DNS resolve.
- Conferir:

```bash
vercel domains inspect meudominio.com.br
dig meudominio.com.br +short
```

Pronto: `https://meudominio.com.br` no ar, com deploy automático a cada `git push`.

---

## Resumão (a régua)

```
código local → git commit → git push → GitHub
                                         │
                                         └─→ Vercel (build + deploy automático)
                                                   │
   Registro.br (compra) → DNS aponta pro Vercel ───┘ → https://meudominio.com.br
```
