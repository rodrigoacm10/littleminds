/**
 * AgeGroup Enum
 *
 * Define as faixas etárias das crianças.
 * Usado para categorizar conteúdo, posts e artigos por fase do desenvolvimento.
 *
 * Cada faixa representa um momento distinto do desenvolvimento infantil,
 * com características e desafios específicos que os pais enfrentam.
 */
export enum AgeGroup {
  /**
   * Gestação - Período pré-natal.
   * Foco em preparação para chegada do bebê, saúde da gestante,
   * planejamento familiar e expectativas dos pais.
   */
  PRENATAL = 'PRENATAL',

  /**
   * Bebê - 0 a 2 anos.
   * Primeira infância, amamentação, sono, desenvolvimento motor inicial.
   * Fase de descobertas e construção do vínculo.
   */
  BABY = 'BABY',

  /**
   * Primeira Infância - 3 a 5 anos.
   * Socialização, entrada na escola, desenvolvimento da linguagem.
   * Fase de "porquês" e muita curiosidade.
   */
  TODDLER = 'TODDLER',

  /**
   * Criança - 6 a 12 anos.
   * Escola fundamental, amizades, atividades extracurriculares.
   * Desenvolvimento de autonomia e responsabilidades.
   */
  CHILD = 'CHILD',

  /**
   * Adolescente - 13+ anos.
   * Adolescência, identidade, independência, desafios emocionais.
   * Transição para vida adulta.
   */
  TEENAGER = 'TEENAGER',
}

/**
 * Utilitário para verificar se um valor é um AgeGroup válido.
 */
export function isValidAgeGroup(value: string): value is AgeGroup {
  return Object.values(AgeGroup).includes(value as AgeGroup);
}

/**
 * Retorna uma descrição humana da faixa etária.
 * Útil para exibição no front-end.
 */
export function getAgeGroupLabel(ageGroup: AgeGroup): string {
  const labels: Record<AgeGroup, string> = {
    [AgeGroup.PRENATAL]: 'Gestação',
    [AgeGroup.BABY]: '0 a 2 anos',
    [AgeGroup.TODDLER]: '3 a 5 anos',
    [AgeGroup.CHILD]: '6 a 12 anos',
    [AgeGroup.TEENAGER]: '13+ anos',
  };
  return labels[ageGroup];
}