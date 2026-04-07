# Gestor Comercial

ERP web em desenvolvimento, pensado para centralizar as operações de pequenos negócios em um único sistema.

O projeto está sendo estruturado de forma modular para suportar fluxos como:

- vendas
- pedidos via WhatsApp
- estoque
- cadastros
- financeiro
- logística
- usuários
- configurações

---

## Objetivo do projeto

O objetivo do **Gestor Comercial** é servir como base para um ERP operacional, com foco em organização de processos, visual consistente e facilidade de evolução do sistema ao longo do tempo.

---

## Objetivo deste README

Este README foi feito para ajudar qualquer colaborador, inclusive quem está tendo o primeiro contato com o projeto, a entender:

- o que o projeto é
- quais tecnologias ele usa
- como rodar localmente
- como o código está organizado
- para que servem os principais arquivos e pastas
- o impacto de alterações em pontos importantes do sistema

---

## Stack utilizada

### Tecnologias principais

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Bibliotecas auxiliares

- **Lucide React** para ícones
- **React Hook Form** para formulários
- **Zod** para validação
- **Zustand** para gerenciamento de estado no cliente

---

## O que cada tecnologia faz

### Next.js

Framework principal do projeto.  
Responsável por:

- rotas
- build
- ambiente de desenvolvimento
- estrutura da aplicação

### React

Biblioteca usada para construir a interface em componentes reutilizáveis.

### TypeScript

Versão tipada do JavaScript.  
Ajuda a reduzir erros e deixa o código mais previsível.

### Tailwind CSS

Sistema de estilização baseado em classes utilitárias.  
Grande parte do visual do projeto é feita diretamente no `className` dos componentes.

Exemplo:

```tsx
<button className="bg-blue-600 text-white px-4 py-2 rounded-xl">
  Salvar
</button>
````

---

## Requisitos para rodar o projeto

Antes de começar, é recomendável ter instalado:

* **Node.js**
* **npm**

Para conferir se já estão instalados:

```bash
node -v
npm -v
```

---

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd gestor-comercial
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Rodar em ambiente de desenvolvimento

```bash
npm run dev
```

### 4. Abrir no navegador

Normalmente o projeto ficará disponível em:

```txt
http://localhost:3000
```

---

## Scripts principais

### `npm run dev`

Inicia o projeto localmente em modo de desenvolvimento.

### `npm run build`

Gera a build de produção.

### `npm run start`

Executa a aplicação a partir da build gerada.

### `npm run lint`

Roda a verificação de qualidade de código.

---

## Estrutura geral do projeto

```txt
gestor-comercial/
├─ public/
├─ src/
├─ .gitignore
├─ next.config.ts
├─ package.json
├─ package-lock.json
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
└─ README.md
```

---

## Arquivos principais da raiz

### `package.json`

**Serve para:** definir scripts, dependências e metadados do projeto.
**Se você mexer nele:** pode adicionar ou remover bibliotecas, alterar scripts ou quebrar o ambiente se algo for configurado incorretamente.
**Observação útil:** sempre que esse arquivo mudar, normalmente é bom rodar `npm install` novamente.

### `package-lock.json`

**Serve para:** travar versões exatas das dependências instaladas.
**Se você mexer nele:** pode alterar o ambiente instalado em outras máquinas.
**Observação útil:** normalmente ele não deve ser editado manualmente.

### `next.config.ts`

**Serve para:** configurar o comportamento do Next.js.
**Se você mexer nele:** pode afetar build, redirects, imagens e configurações estruturais do framework.

### `tailwind.config.ts`

**Serve para:** configurar o Tailwind CSS.
**Se você mexer nele:** pode mudar tema, cores, caminhos escaneados e comportamento das classes utilitárias.

### `postcss.config.mjs`

**Serve para:** integrar o Tailwind ao pipeline de CSS.
**Se você mexer nele:** pode quebrar o processamento de estilos.

### `tsconfig.json`

**Serve para:** configurar o TypeScript.
**Se você mexer nele:** pode alterar regras de tipagem, aliases e comportamento de compilação.

### `.gitignore`

**Serve para:** impedir que arquivos indevidos subam para o GitHub.
**Atualmente ignora**, entre outros:

* `node_modules/`
* `.next/`
* `build/`
* `.env*`
* `.vscode/`

---

## Estrutura do `src`

```txt
src/
├─ app/
├─ components/
├─ config/
├─ data/
├─ hooks/
├─ lib/
├─ modules/
├─ types/
```

### `src/app/`

Define rotas e estrutura principal da aplicação.

### `src/components/`

Guarda componentes reutilizáveis de interface.

### `src/config/`

Guarda configurações centralizadas, especialmente de navegação.

### `src/data/`

Armazena dados mockados ou fictícios usados no desenvolvimento.

### `src/hooks/`

Guarda hooks React reutilizáveis.

### `src/lib/`

Guarda funções auxiliares e lógica pura.

### `src/modules/`

Organiza o sistema por domínio de negócio.

### `src/types/`

Guarda tipos TypeScript usados no projeto.

---

## Arquivos e pastas importantes do `src`

## `src/app`

```txt
src/app/
├─ globals.css
├─ layout.tsx
├─ page.tsx
├─ estoque/
├─ financeiro/
├─ vendas/
├─ usuarios/
├─ logistica/
├─ configuracoes/
├─ cadastros/
```

### `src/app/globals.css`

**Serve para:** CSS global do projeto.
**Se você mexer nele:** pode alterar o visual do sistema inteiro.
**Informação útil:** use quando quiser mudar tema global, variáveis de cor e estilos base do app.

### `src/app/layout.tsx`

**Serve para:** layout raiz da aplicação.
**Se você mexer nele:** pode alterar a estrutura global de todas as páginas.
**Informação útil:** use quando quiser mudar wrappers globais, shell geral, metadados ou estrutura base.

### `src/app/page.tsx`

**Serve para:** rota principal `/`.
**Se você mexer nele:** pode mudar a Home ou o redirecionamento inicial do sistema.

### `src/app/estoque/`

**Serve para:** rotas do módulo de estoque.
**Se você mexer nele:** pode alterar páginas acessadas em `/estoque`.

### `src/app/financeiro/`

**Serve para:** rotas do módulo financeiro.
**Se você mexer nele:** pode alterar páginas do financeiro.

### `src/app/vendas/`

**Serve para:** rotas do módulo de vendas.
**Se você mexer nele:** pode alterar páginas e fluxos de venda.

### `src/app/usuarios/`

**Serve para:** rotas do módulo de usuários.
**Se você mexer nele:** pode afetar gestão de usuários e permissões visuais.

### `src/app/logistica/`

**Serve para:** rotas do módulo de logística.
**Se você mexer nele:** pode alterar páginas e fluxos logísticos.

### `src/app/configuracoes/`

**Serve para:** rotas do módulo de configurações.
**Se você mexer nele:** pode alterar telas de configuração do sistema.

### `src/app/cadastros/`

**Serve para:** rotas do módulo de cadastros.
**Se você mexer nele:** pode alterar páginas de cadastro e manutenção de entidades.

---

## `src/components`

```txt
src/components/
├─ estoque/
├─ layout/
├─ navigation/
├─ page/
```

### `src/components/layout/app-shell.tsx`

**Serve para:** estrutura externa da aplicação.
**Se você mexer nele:** pode mudar o layout base de várias páginas.

### `src/components/layout/app-header.tsx`

**Serve para:** cabeçalho do sistema.
**Se você mexer nele:** pode alterar o topo, a navegação superior e a experiência geral de uso.

### `src/components/navigation/module-mega-menu.tsx`

**Serve para:** menu expansível dos módulos.
**Se você mexer nele:** pode alterar a navegação e a organização do mega menu.

---

## `src/components/page`

### `action-bar.tsx`

**Serve para:** barra de ações das páginas.
**Se você mexer nele:** pode mudar ações rápidas em várias telas.

### `data-table.tsx`

**Serve para:** componente de tabela.
**Se você mexer nele:** pode alterar a aparência e o comportamento de várias listagens.

### `empty-state.tsx`

**Serve para:** estado vazio de páginas e listas.
**Se você mexer nele:** pode mudar como o sistema comunica ausência de dados.

### `filter-bar.tsx`

**Serve para:** barra de filtros.
**Se você mexer nele:** pode impactar a filtragem em várias telas.

### `page-container.tsx`

**Serve para:** container padrão das páginas.
**Se você mexer nele:** pode alterar espaçamentos e largura de muitas páginas.

### `section-header.tsx`

**Serve para:** cabeçalho de seções.
**Se você mexer nele:** pode mudar títulos e subtítulos em várias partes do sistema.

### `stat-card.tsx`

**Serve para:** card de métricas e indicadores.
**Se você mexer nele:** pode alterar dashboards e resumos operacionais.

### `status-badge.tsx`

**Serve para:** badge visual de status.
**Se você mexer nele:** pode alterar a leitura visual de estados em várias telas.

---

## `src/components/estoque`

### `EstoqueDashboardPage.tsx`

**Serve para:** dashboard principal do módulo de estoque.
**Se você mexer nele:** pode alterar a visão geral operacional do estoque.

### `EstoqueProdutosPage.tsx`

**Serve para:** listagem de produtos.
**Se você mexer nele:** pode alterar a principal visão de produtos do estoque.

### `EstoqueMovimentacoesPage.tsx`

**Serve para:** histórico de movimentações.
**Se você mexer nele:** pode alterar rastreabilidade e auditoria operacional.

### `EstoqueEntradasPage.tsx`

**Serve para:** registro e listagem de entradas de estoque.
**Se você mexer nele:** pode alterar fluxo de reposição e entrada de mercadoria.

### `EstoqueFornecedoresPage.tsx`

**Serve para:** gestão de fornecedores.
**Se você mexer nele:** pode alterar relacionamento entre estoque e fornecedores.

### `EstoqueCategoriasPage.tsx`

**Serve para:** gestão de categorias.
**Se você mexer nele:** pode alterar organização e classificação dos produtos.

### `EstoqueTransferenciasPage.tsx`

**Serve para:** transferências de estoque.
**Se você mexer nele:** pode alterar movimentações internas.

### `EstoqueComprasPage.tsx`

**Serve para:** compras e reposição planejada.
**Se você mexer nele:** pode impactar planejamento de abastecimento.

### `EstoqueDepositosPage.tsx`

**Serve para:** depósitos e localizações.
**Se você mexer nele:** pode alterar estrutura de armazenagem.

### `EstoqueInventarioPage.tsx`

**Serve para:** inventário.
**Se você mexer nele:** pode alterar conferência e ajuste de estoque.

### `EstoqueProdutoDetailPage.tsx`

**Serve para:** detalhe de um produto.
**Se você mexer nele:** pode mudar a visão individual do item.

### `EstoqueProdutoEditarPage.tsx`

**Serve para:** edição de produto.
**Se você mexer nele:** pode alterar o fluxo de manutenção do cadastro.

### `EstoqueProdutoNovoPage.tsx`

**Serve para:** cadastro de novo produto.
**Se você mexer nele:** pode alterar o fluxo de entrada de novos itens.

### `EstoqueRelatoriosPage.tsx`

**Serve para:** relatórios do módulo de estoque.
**Se você mexer nele:** pode alterar a visão analítica e gerencial.

---

## `src/config`

### `src/config/module-navigation.ts`

**Serve para:** estruturar navegação por módulos.
**Se você mexer nele:** pode mudar nomes, ordem e links dos módulos do sistema.

### `src/config/navigation.ts`

**Serve para:** adaptar e organizar a navegação para uso nos componentes.
**Se você mexer nele:** pode impactar menus e comportamento do header.

---

## `src/data`

### `src/data/mock/`

**Serve para:** guardar dados fictícios usados no desenvolvimento.
**Se você mexer nele:** pode alterar exemplos exibidos em páginas, tabelas e dashboards.

### `src/data/mock/index.ts`

**Serve para:** centralizar exportação dos mocks.
**Se você mexer nele:** pode quebrar importações de dados simulados.

---

## `src/hooks`

### `src/hooks/estoque/`

**Serve para:** hooks React do módulo de estoque.
**Se você mexer nele:** pode alterar filtros, carregamento e lógica de telas de estoque.

---

## `src/lib`

### `src/lib/estoque/`

**Serve para:** funções auxiliares e lógica pura do estoque.
**Se você mexer nele:** pode alterar cálculos, transformações e regras reutilizadas por várias telas.

---

## `src/modules`

```txt
src/modules/
├─ cadastros/
├─ configuracoes/
├─ estoque/
├─ financeiro/
├─ logistica/
├─ shared/
├─ usuarios/
├─ vendas/
```

### `src/modules/cadastros/`

**Serve para:** organização interna do módulo de cadastros.
**Se você mexer nele:** pode alterar regras e estrutura dessa área.

### `src/modules/configuracoes/`

**Serve para:** organização interna do módulo de configurações.
**Se você mexer nele:** pode alterar comportamentos dessa área do sistema.

### `src/modules/estoque/`

**Serve para:** organização interna do módulo de estoque.
**Se você mexer nele:** pode alterar lógica e estrutura do principal módulo atual.

### `src/modules/financeiro/`

**Serve para:** organização interna do financeiro.
**Se você mexer nele:** pode alterar a arquitetura dessa área.

### `src/modules/logistica/`

**Serve para:** organização interna da logística.
**Se você mexer nele:** pode alterar fluxos logísticos do sistema.

### `src/modules/shared/`

**Serve para:** recursos compartilhados entre módulos.
**Se você mexer nele:** pode afetar várias áreas ao mesmo tempo.

### `src/modules/shared/views/home-operational-page.tsx`

**Serve para:** Home operacional do sistema.
**Se você mexer nele:** pode alterar a página inicial operacional, cards e ações rápidas.

### `src/modules/usuarios/`

**Serve para:** organização interna do módulo de usuários.
**Se você mexer nele:** pode impactar gestão de usuários e permissões.

### `src/modules/vendas/`

**Serve para:** organização interna do módulo de vendas.
**Se você mexer nele:** pode impactar fluxos comerciais e de atendimento.

---

## `src/types`

### `src/types/estoque/`

**Serve para:** tipos TypeScript do domínio de estoque.
**Se você mexer nele:** pode alterar contratos de dados usados em vários arquivos do módulo.

### `src/types/index.ts`

**Serve para:** centralizar exportação de tipos.
**Se você mexer nele:** pode facilitar ou quebrar importações tipadas do projeto.

---

## Como encontrar e alterar estilos

Este projeto usa principalmente **Tailwind CSS**, então muito do “CSS” está direto no `className` dos componentes.

Exemplo:

```tsx
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
```

Cada parte da classe faz algo:

* `rounded-2xl` → bordas arredondadas
* `border` → ativa borda
* `border-slate-200` → cor da borda
* `bg-white` → fundo branco
* `p-6` → espaçamento interno
* `shadow-sm` → sombra leve

### Para mudar o estilo de um componente específico

#### Opção 1: buscar o texto visível

Se o botão mostra `Nova venda`, pesquise por `Nova venda` no VS Code.

#### Opção 2: inspecionar no navegador

* clique com o botão direito no elemento
* selecione **Inspecionar**
* veja as classes aplicadas no HTML

#### Opção 3: localizar o componente

Se você sabe que aquilo é um `StatCard`, `SectionHeader`, `ActionBar` etc., procure esse nome no projeto.

### Onde mudar

#### Mudança local

Normalmente no próprio `className` do componente `.tsx`.

#### Mudança global

Normalmente em:

```txt
src/app/globals.css
```

#### Mudança estrutural do Tailwind

Normalmente em:

```txt
tailwind.config.ts
```

---

## Regras práticas para novos colaboradores

### Antes de mexer em um componente reutilizável

Confirme onde ele é usado.
Mudar um componente-base pode alterar várias páginas ao mesmo tempo.

### Antes de mexer no layout global

Revise:

* `src/app/layout.tsx`
* `src/components/layout/app-shell.tsx`
* `src/app/globals.css`

### Antes de mexer na navegação

Revise:

* `src/config/module-navigation.ts`
* `src/config/navigation.ts`
* `src/components/layout/app-header.tsx`
* `src/components/navigation/module-mega-menu.tsx`

### Antes de mexer na Home

Revise:

* `src/app/page.tsx`
* `src/modules/shared/views/home-operational-page.tsx`
* `src/components/page/stat-card.tsx`

### Antes de mexer no estoque

Revise:

* `src/components/estoque/*`
* `src/hooks/estoque/*`
* `src/lib/estoque/*`
* `src/types/estoque/*`
* `src/data/mock/estoque/*`

---

## Estado atual do projeto

* o projeto ainda está em desenvolvimento
* parte das telas pode usar dados mockados
* a arquitetura já foi organizada para crescimento modular
* o módulo de estoque é, até aqui, um dos mais detalhados
* o sistema ainda está em evolução funcional e visual

---

## Fluxo recomendado para novos colaboradores

### 1. Ler este README

Entender a estrutura antes de editar o código.

### 2. Rodar o projeto

```bash
npm install
npm run dev
```

### 3. Identificar a área onde vai atuar

Exemplo:

* Home
* estoque
* vendas
* layout
* navegação

### 4. Localizar o componente ou página real

Use:

* busca do VS Code
* inspeção no navegador
* navegação pelas pastas

### 5. Confirmar o impacto da alteração

Pergunte:

* isso muda só minha página?
* isso muda um componente compartilhado?
* isso altera o sistema inteiro?

---

## Boas práticas para manutenção

* reutilize componentes existentes sempre que possível
* evite duplicar estrutura visual
* evite criar estilos fora do padrão atual sem necessidade
* centralize lógica reutilizável em `hooks/` e `lib/`
* valide impacto antes de editar componentes compartilhados
* teste a interface após mudanças visuais e estruturais

---

## Resumo final

Os pontos mais importantes da arquitetura são:

* `src/app/` → rotas e estrutura principal
* `src/components/` → componentes reutilizáveis
* `src/modules/` → organização por domínio de negócio
* `src/config/` → navegação e configuração
* `src/data/mock/` → dados simulados
* `src/hooks/` → lógica React reutilizável
* `src/lib/` → utilitários e lógica pura
* `src/types/` → contratos TypeScript
* `src/app/globals.css` → CSS global
* `className` nos componentes → estilização com Tailwind

Se você está chegando agora, o melhor caminho é:

1. rodar o projeto
2. entender a navegação
3. localizar a área onde vai atuar
4. identificar o componente ou arquivo certo
5. só então começar a alterar o código
