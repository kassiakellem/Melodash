# Melodash
<img width="1355" height="610" alt="melodash" src="https://github.com/user-attachments/assets/96914f19-3023-4a24-8e24-603caa1af202" />

# 🎵 Melodash — Scalable Fan-Equity Music Protocol

> **"Onde todo mundo ganha!"**

Uma plataforma de streaming Web3 construída sobre a **Monad**, transformando ouvintes em **investidores do sucesso dos artistas** através de **Listen-to-Earn (L2E)** e **Fan-Equity**.

---

## 📌 Sumário

- [🚀 Sobre o Projeto](#-sobre-o-projeto)
- [💡 Problema](#-problema)
- [✨ Solução](#-solução)
- [⚡ Por que Monad](#-por-que-monad)
- [🛠️ Regras de Negócio (MVP)](#️-regras-de-negócio-mvp)
- [🏗️ Arquitetura](#️-arquitetura)
- [🎨 Design System](#-design-system)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Como Rodar o Projeto](#️-como-rodar-o-projeto)
- [🧪 Testes](#-testes)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)
- [👥 Equipe](#-equipe)

---

## 🚀 Sobre o Projeto

O **MeloDash** é uma plataforma de streaming descentralizada que redefine o modelo atual da indústria musical.

Aqui, usuários não são apenas ouvintes — eles se tornam **participantes ativos da economia dos artistas**.

### Principais Features:

- 🎧 Listen-to-Earn (L2E)
- 💸 Cashback por engajamento
- 🎤 Fan-Equity (participação nos ganhos do artista)
- ⛓️ Distribuição de royalties on-chain
- 🛡️ Sistema anti-bot avançado

---

## 💡 Problema

O modelo atual de streaming apresenta falhas críticas:

- 💰 Baixa remuneração para artistas  
- 🏢 Centralização das plataformas  
- ❌ Fãs não participam do valor gerado  
- 🤖 Fraudes em plays e métricas infladas  

---

## ✨ Solução

O MeloDash resolve isso com:

- ✅ Distribuição justa de receita  
- ✅ Incentivo direto ao engajamento real  
- ✅ Tokenização da relação fã-artista  
- ✅ Transparência via blockchain  

---

## ⚡ Por que Monad

A **Monad** permite que o MeloDash funcione em escala real.

### Benefícios:

- 🚀 Execução paralela otimista  
- ⚡ Altíssimo throughput  
- 💸 Taxas quase zero  
- 📈 Escalabilidade para milhões de usuários  

Sem a Monad, micro-recompensas em tempo real seriam inviáveis.

---

## 🛠️ Regras de Negócio (MVP)

### 💳 Assinatura

- Valor: **$20/mês**
- Pagamento: **USDC** ou token nativo

---

### 💰 Distribuição de Receita

| Pool            | %   | Descrição |
|-----------------|-----|----------|
| 🎤 Artist Pool   | 60% | Baseado em horas ouvidas |
| 🎧 Cashback Pool | 10% | Usuários engajados |
| 🏗️ Platform Pool | 30% | Sustentabilidade |

---

### 🎯 Cashback

- Meta: **100h/mês**
- Mínimo: **90h**
- Distribuição proporcional

---

### 🛡️ Anti-Fraude

- ⛔ Plays < 30s não contam  
- 🔁 Máx. 3 repetições consecutivas  
- 🧠 Sessão única (BroadcastChannel API)  

---

## 🏗️ Arquitetura

### 🎨 Frontend

- Next.js 14 (App Router)  
- TypeScript  
- Tailwind CSS  
- Lucide React  

---

### 🔗 Blockchain

- Rede: Monad (Testnet)  
- Solidity (Smart Contracts)  

---

### 🧠 Backend / Oracle

- Validação de consumo off-chain  
- Assinatura de dados  
- Consolidação on-chain mensal  

---

## 🎨 Design System

### 🎨 Cores

| Nome            | Cor |
|-----------------|-----|
| Primary Purple  | #23154eef |
| Accent Berry    | #A0055D |
| Background      | #0C0C0C |

### ✨ Estilo

- Glassmorphism  
- Neon borders  
- Dark UI  
- Minimalista futurista  

---

## 📁 Estrutura do Projeto

/
├── app/           # Rotas (Fã vs Artista)
├── components/    # UI (Player, Dashboard, Login)
├── hooks/         # Lógica (useMeloDash)
├── contracts/     # Smart Contracts
├── constants/     # Configs e ABIs
└── public/        # Assets


## ⚡ Hackathon
## Equipe 
#### Um time dedicado a revolucionar a economia da música na Web3: 
Kássia Kellem — CEO / Founder & Front-end <br>
Herick Danilo — Back-end <br>
Robson Maia — QA (Quality Assurance)

Desenvolvido No Hackathon Monad em São Paulo.

