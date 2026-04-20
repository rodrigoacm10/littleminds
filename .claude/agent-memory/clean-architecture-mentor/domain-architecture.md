---
name: Domain Layer Architecture
description: Arquitetura da camada de domínio implementada
type: reference
---

**Estrutura da camada de domínio:**

```
src/domain/
├── entities/         # Entidades com identidade única
│   ├── entity.base.ts    # Classe base para todas as entidades
│   ├── forum-post.entity.ts  # Postagens do fórum
│   ├── article.entity.ts     # Artigos especializados
│   └── comment.entity.ts     # Comentários em posts
├── value-objects/    # Objetos de valor imutáveis
│   ├── content.vo.ts     # Conteúdo de texto
│   ├── title.vo.ts       # Títulos com validação
│   └── author-id.vo.ts   # Referência ao autor
├── repositories/     # Interfaces de persistência
│   ├── forum-post.repository.ts
│   └── article.repository.ts
└── exceptions/       # Exceções de domínio
```

**Princípios aplicados:**
- SRP: Cada classe tem uma responsabilidade única
- OCP: Entidades extensíveis sem modificação
- DIP: Interfaces de repositório definidas pelo domínio

**Como usar:**
- Sempre criar value objects para validação
- Entidades devem ter métodos de domínio ricos
- Repositórios são interfaces - implementações ficam em `infra/`