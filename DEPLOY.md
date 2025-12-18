# 🚀 Deploy no GitHub Pages

## Configuração Inicial (fazer uma vez)

1. **Vá nas configurações do repositório no GitHub:**
   - Acesse: `https://github.com/Nandolinhares/roleta-arcade/settings/pages`

2. **Configure o GitHub Pages:**
   - Em **"Source"**, selecione: **"GitHub Actions"**
   - Salve as configurações

## Deploy Automático

Agora toda vez que você fizer `git push` na branch `main`, o GitHub Actions vai:

1. ✅ Instalar as dependências (`yarn install`)
2. ✅ Fazer o build da aplicação (`yarn build`)
3. ✅ Publicar automaticamente no GitHub Pages

## Verificar o Deploy

Após o push, você pode:

1. Ver o progresso em: `https://github.com/Nandolinhares/roleta-arcade/actions`
2. Quando terminar (✅ verde), acesse: `https://nandolinhares.github.io/roleta-arcade/`

## Testar Localmente

```bash
# Desenvolvimento (com hot reload)
yarn dev

# Build de produção
yarn build

# Preview do build (simula produção)
yarn preview
```

## Troubleshooting

### O site não carrega CSS/JS
- Certifique-se que configurou "Source: GitHub Actions" nas settings
- Aguarde o workflow completar (ícone verde no Actions)

### Erro 404
- Verifique se o base no `vite.config.js` está correto
- Para GitHub Actions, deve ser: `/roleta-arcade/`

### O deploy não inicia
- Verifique se tem permissões de Pages habilitadas no repositório
- O arquivo `.github/workflows/deploy.yml` deve estar na branch main
