# 🚀 Quick Start - Roleta Arcade

## Iniciando o Projeto

### 1️⃣ Instalar Dependências
```bash
yarn install
```

### 2️⃣ Iniciar Servidor de Desenvolvimento
```bash
yarn dev
```

O servidor iniciará em **http://localhost:3000** e abrirá automaticamente no navegador.

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `yarn dev` | Inicia servidor de desenvolvimento |
| `yarn build` | Cria build otimizado para produção |
| `yarn preview` | Visualiza o build de produção localmente |

## 🏗️ Estrutura do Projeto

```
roleta/
├── index.html              # HTML principal
├── package.json            # Configuração do projeto
├── vite.config.js          # Configuração do Vite
├── yarn.lock               # Lock de dependências
│
└── src/
    ├── styles/
    │   └── main.css       # Estilos customizados
    │
    └── scripts/
        ├── app.js         # Ponto de entrada (importa todos os módulos)
        ├── audioManager.js    # Gerenciamento de áudio
        ├── storageManager.js  # Persistência de dados
        ├── wheelManager.js    # Lógica da roleta
        └── uiManager.js       # Interface do usuário
```

## 🎯 Arquitetura Limpa

- **ES6 Modules**: Código modular e organizado
- **Separação de Responsabilidades**: Cada módulo tem uma função específica
- **Vite**: Build tool moderno e rápido
- **Hot Module Replacement**: Atualizações instantâneas durante desenvolvimento

## 🔧 Desenvolvimento

1. O Vite detecta mudanças automaticamente
2. O navegador atualiza sem reload completo (HMR)
3. Erros aparecem no navegador e no terminal
4. Performance otimizada com cache inteligente

## 📦 Build de Produção

```bash
yarn build
```

Isso gera:
- Arquivos otimizados e minificados em `dist/`
- CSS extraído e minificado
- JavaScript com tree-shaking
- Assets otimizados

## 🌐 Deploy

Após o build, você pode fazer deploy da pasta `dist/` para:
- GitHub Pages
- Netlify
- Vercel
- Qualquer servidor web estático

## 🆘 Problemas Comuns

### Porta 3000 já em uso?
```bash
# O Vite tentará automaticamente a próxima porta disponível
# Ou configure em vite.config.js
```

### Erro de módulo não encontrado?
```bash
yarn install
```

### Navegador não abre automaticamente?
Acesse manualmente: **http://localhost:3000**

## 💡 Dicas

- Use `Ctrl+C` para parar o servidor
- Use `r` no terminal para forçar reload
- Use `h` no terminal para ver ajuda do Vite
- DevTools do navegador para debug

---

**Pronto para começar!** 🎰
Execute `yarn dev` e comece a desenvolver!
