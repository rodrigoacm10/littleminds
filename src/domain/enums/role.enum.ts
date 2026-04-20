/**
 * Role Enum
 *
 * Define os papéis de usuário no sistema Little Minds.
 * Cada role tem responsabilidades e permissões distintas.
 *
 * Clean Architecture: Enums são conceitos de negócio puros,
 * sem dependências de frameworks ou infraestrutura.
 */
export enum Role {
  /**
   * Pai/Mãe - Consumidor principal da plataforma.
   * Pode criar posts no fórum, comentar e conversar com a IA.
   * Relata experiências vivenciadas com seus filhos.
   */
  PARENT = 'PARENT',

  /**
   * Especialista - Profissional da área.
   * Pode publicar artigos técnicos e responder como especialista.
   * Possui conhecimento aprofundado em desenvolvimento infantil.
   */
  SPECIALIST = 'SPECIALIST',

  /**
   * Administrador - Controle total do sistema.
   * Gerencia usuários, conteúdo e configurações da plataforma.
   */
  ADMIN = 'ADMIN',
}

/**
 * Utilitário para verificar se um valor é uma Role válida.
 * Útil para validação de dados vindos de fora do domínio.
 */
export function isValidRole(value: string): value is Role {
  return Object.values(Role).includes(value as Role);
}