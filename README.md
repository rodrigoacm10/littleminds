# Little Minds

<p align="center">
  Plataforma educacional com foco em <strong>inteligência emocional infantil</strong>, conectando conteúdo especializado, comunidade de apoio e orientação assistida por IA para pais e responsáveis.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="React + Vite" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=111111" alt="Render" />
</p>

## Visão Geral

O **Little Minds** nasceu da necessidade de tornar a educação emocional infantil mais acessível no ambiente doméstico. A proposta do projeto é apoiar pais e responsáveis no desenvolvimento da inteligência emocional de seus filhos desde os primeiros anos de vida, traduzindo conteúdos especializados em uma experiência digital acolhedora, prática e escalável.

Na prática, a plataforma oferece três pilares complementares:

1. **Conteúdo especializado** para estudo orientado sobre desenvolvimento emocional infantil.
2. **Comunidade de apoio** para troca de experiências, dificuldades e aprendizados entre famílias.
3. **Chat com IA** para descomplicar conceitos técnicos e oferecer orientações contextualizadas no dia a dia.

## Contexto e Funcionamento

### O problema

Pais e responsáveis frequentemente enfrentam dificuldades para lidar com questões ligadas à educação emocional infantil. Embora o tema seja essencial para o desenvolvimento saudável da criança, ainda há escassez de plataformas acessíveis, organizadas e centradas nessa jornada de aprendizagem.

### A solução proposta

O **Little Minds** foi concebido como uma plataforma digital de apoio à parentalidade, reunindo informação qualificada, espaço de escuta coletiva e assistência conversacional com Inteligência Artificial.

### Como o sistema funciona

Após o cadastro, o usuário passa a acessar os principais módulos da plataforma:

| Pilar | Descrição |
| --- | --- |
| **Conteúdo** | Catálogo de artigos especializados para estudo aprofundado sobre inteligência emocional, fases do desenvolvimento e boas práticas familiares. |
| **Comunidade** | Fórum colaborativo no qual usuários podem criar publicações, comentar experiências e demonstrar apoio por meio de interações sociais. |
| **Rede de Apoio com IA** | Chat integrado ao Google Gemini para esclarecer dúvidas, simplificar conteúdos técnicos e manter o histórico das conversas. |

## Acesso Rápido

| Recurso | Link |
| --- | --- |
| **Frontend - Repositório** | https://github.com/rodrigoacm10/littleminds-front |
| **Frontend - Deploy** | https://littleminds-front.vercel.app |
| **Backend - Repositório** | https://github.com/rodrigoacm10/littleminds |
| **Backend - Deploy** | https://littleminds.onrender.com |
| **Swagger da API** | https://littleminds.onrender.com/api |
| **Protótipo Figma** | _Adicionar link do Figma aqui_ |

## Credenciais de Teste

Para facilitar a avaliação funcional da plataforma, os seguintes acessos de demonstração estão disponíveis:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| **Usuário padrão** | `teste@gmail.com` | `Teste1234` |
| **Especialista** | `testeespecialista@gmail.com` | `Teste1234` |

> [!IMPORTANT]
> **Aviso sobre infraestrutura:** o backend está hospedado no plano gratuito do **Render**. Em períodos de inatividade, o servidor pode entrar em hibernação. Nesses casos, a **primeira requisição pode levar entre 50 segundos e 1 minuto** para responder devido ao processo de cold start. Para a banca avaliadora, recomenda-se aguardar esse primeiro carregamento antes de repetir a ação.

## Funcionalidades

### Requisitos funcionais principais

| Código | Requisito |
| --- | --- |
| **RF01** | Cadastro de usuários com autenticação segura. |
| **RF02** | Login com validação de credenciais e emissão de token JWT. |
| **RF03** | Leitura de artigos e navegação no catálogo de conteúdos. |
| **RF04** | Criação de publicações no fórum da comunidade. |
| **RF05** | Interação social com comentários e apoios em publicações. |
| **RF06** | Uso de chatbot com IA integrado ao Google Gemini. |
| **RF07** | Persistência do histórico de conversas com a IA. |
| **RF08** | Acesso a rotas protegidas com autenticação por token. |

### Requisitos não funcionais principais

| Código | Requisito |
| --- | --- |
| **RNF01** | Interface web responsiva construída com React + Vite. |
| **RNF02** | API organizada em NestJS com documentação Swagger. |
| **RNF03** | Persistência relacional em PostgreSQL com Prisma ORM. |
| **RNF04** | Separação de responsabilidades com foco em manutenibilidade e escalabilidade. |
| **RNF05** | Qualidade assegurada por testes unitários, de integração e E2E. |
| **RNF06** | Deploy em nuvem com serviços públicos para validação acadêmica e demonstração. |

## Arquitetura e Tecnologias

### Stack do projeto

| Camada | Tecnologia | Finalidade |
| --- | --- | --- |
| **Frontend** | React + Vite | Construção da interface e experiência do usuário. |
| **Backend** | Node.js + NestJS | API REST, regras de negócio e integração com serviços externos. |
| **Banco de Dados** | PostgreSQL (Neon DB) | Armazenamento relacional de usuários, artigos, fórum e conversas. |
| **ORM** | Prisma | Mapeamento e acesso estruturado ao banco de dados. |
| **IA** | Google Gemini | Geração de respostas contextualizadas para o chat de apoio. |
| **Deploy Frontend** | Vercel | Hospedagem da aplicação cliente. |
| **Deploy Backend** | Render | Hospedagem da API. |
| **Documentação da API** | Swagger | Visualização e teste dos endpoints. |

### Arquitetura da aplicação

O backend foi estruturado em camadas, favorecendo legibilidade, evolução incremental e isolamento de responsabilidades:

| Camada | Responsabilidade |
| --- | --- |
| **Domain** | Entidades, enums, contratos de repositórios e regras centrais do negócio. |
| **Application** | Casos de uso da plataforma, organizando o fluxo da regra de negócio. |
| **Interface** | Controllers HTTP, DTOs, autenticação e exposição da API. |
| **Infrastructure** | Persistência com Prisma/PostgreSQL, autenticação e integração com Gemini. |

### Metodologia e design

| Frente | Ferramenta / Abordagem |
| --- | --- |
| **Gestão do projeto** | Kanban com Trello |
| **Prototipação** | Figma, com MVP navegável e validável |
| **Trabalho em equipe** | Desenvolvimento colaborativo em grupo |

## Evolução de Código e Qualidade

Esta seção foi pensada para evidenciar maturidade de engenharia no processo de desenvolvimento do projeto.

### Fluxo de desenvolvimento

- Uso de **branches separadas** para desenvolvimento de funcionalidades.
- Integração de mudanças por meio de **Pull Requests (PRs)**.
- Padronização do histórico com **Conventional Commits**, utilizando prefixos como `feat:`, `fix:` e `chore:`.
- Organização incremental das entregas para permitir revisão e validação contínua.

### Qualidade técnica

- A API possui **documentação Swagger** disponível no endpoint `/api`.
- As regras de negócio foram cobertas com **testes unitários**, incluindo entidades e casos de uso.
- O projeto também contempla **testes de integração**, com validação do comportamento dos controllers.
- Foram implementados **testes E2E** para cenários completos, incluindo fluxos da comunidade e das conversas com IA.

### Exemplos de cobertura presentes no repositório

- Entidades e value objects com arquivos `*.spec.ts`
- Controllers com testes de integração `*.integration.spec.ts`
- Fluxos completos em `test/*.e2e-spec.ts`

## Como Rodar o Projeto Localmente

### Pré-requisitos

- **Node.js 20+**
- **npm**
- **Docker** e **Docker Compose** (opcional, para subir PostgreSQL local)
- Chave de API válida do **Google Gemini**

### 1. Clonar o repositório

```bash
git clone https://github.com/rodrigoacm10/littleminds.git
cd littleminds
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com valores equivalentes ao exemplo abaixo:

```env
PORT=3000

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"

GEMINI_API_KEY="SUA_CHAVE_GEMINI"
GEMINI_MODEL="gemini-2.5-flash"
GEMINI_BASE_URL="https://generativelanguage.googleapis.com/v1beta"

JWT_SECRET="uma-chave-segura"
JWT_EXPIRES_IN_SECONDS=604800
```

> [!NOTE]
> O projeto utiliza variáveis em `process.env`. Antes de executar localmente, garanta que o `.env` esteja carregado no ambiente do terminal. Em shells compatíveis com Bash, você pode usar:
>
> ```bash
> set -a
> source .env
> set +a
> ```

### 4. Subir o banco de dados local com Docker

```bash
docker compose up -d
```

O `docker-compose.yml` já disponibiliza uma instância local de PostgreSQL na porta `5432`.

### 5. Aplicar migrações e gerar o client do Prisma

```bash
npx prisma migrate dev
npm run prisma:generate
```

### 6. Executar a aplicação

```bash
npm run start:dev
```

Servidor local:

```text
http://localhost:3000
```

Documentação Swagger:

```text
http://localhost:3000/api
```

## Scripts Úteis

| Comando | Descrição |
| --- | --- |
| `npm run start:dev` | Executa a API em modo de desenvolvimento. |
| `npm run build` | Gera o build da aplicação. |
| `npm run start:prod` | Inicia a aplicação em modo de produção. |
| `npm run lint` | Executa o lint e corrige problemas simples. |
| `npm run test` | Executa os testes unitários. |
| `npm run test:e2e` | Executa os testes end-to-end. |
| `npm run test:cov` | Gera relatório de cobertura. |

## Endpoints e Domínios Cobertos

O backend contempla, entre outros, os seguintes domínios da aplicação:

- **Autenticação e usuários**
- **Artigos**
- **Fórum da comunidade**
- **Comentários**
- **Apoios em publicações**
- **Conversas com IA**
- **Mensagens e versionamento de mensagens**

## Equipe Desenvolvedora

Preencha os nomes conforme a formação final do grupo:

| Nome | Papel |
| --- | --- |
| **[Nome do integrante 1]** | [Função / responsabilidade] |
| **[Nome do integrante 2]** | [Função / responsabilidade] |
| **[Nome do integrante 3]** | [Função / responsabilidade] |
| **[Nome do integrante 4]** | [Função / responsabilidade] |
| **[Nome do integrante 5]** | [Função / responsabilidade] |
| **[Nome do integrante 6]** | [Função / responsabilidade] |
| **[Nome do integrante 7]** | [Função / responsabilidade] |
| **[Nome do integrante 8]** | [Função / responsabilidade] |

## Considerações Finais

O **Little Minds** representa uma aplicação de software com propósito social, construída para unir tecnologia, empatia e qualidade técnica em torno de um desafio real: apoiar famílias no desenvolvimento emocional infantil. Além do impacto do problema abordado, o projeto evidencia boas práticas de arquitetura, documentação, versionamento, testes e deploy, compondo uma entrega consistente para avaliação acadêmica e evolução futura.
