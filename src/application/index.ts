/**
 * Application Layer - Clean Architecture
 *
 * Este módulo exporta toda a camada de aplicação.
 * O Application Layer contém:
 *
 * 1. Use Cases: Casos de uso que orquestram operações
 * 2. DTOs/Input/Output: Contratos de entrada e saída
 *
 * Regras de Clean Architecture:
 * - Application depende de Domain (nunca o contrário)
 * - Não depende de Infrastructure (inversão de dependência)
 * - Contém lógica de aplicação, não de negócio
 * - Orquestra o fluxo de dados entre Presentation e Domain
 */

export { ApplicationModule } from './application.module';
export * from './use-cases';