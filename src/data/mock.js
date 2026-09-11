// Provedores de cloud com rótulos 100% genéricos (sem marcas reais).
export const PROVEDORES = ['Provedor A', 'Provedor B', 'Provedor C', 'Provedor D']

// Contas de faturamento fictícias por provedor (usadas no filtro "Contas" da listagem).
export const CONTAS_FATURAMENTO = {
  'Provedor A': ['conta-financas-01', 'conta-financas-02', 'conta-marketing-01'],
  'Provedor B': ['conta-produto-01', 'conta-dados-02'],
  'Provedor C': ['conta-seguranca-01', 'conta-seguranca-02', 'conta-infra-03'],
  'Provedor D': ['conta-infra-01', 'conta-backup-02'],
}

// Workspaces genéricos, agrupados por provedor — usados no cadastro do Vínculo
// (o cadastro seleciona só workspaces; o provedor fica implícito no grupo).
export const WORKSPACES_POR_PROVEDOR = {
  'Provedor A': ['workspace-produto-01', 'workspace-marketing-05'],
  'Provedor B': ['workspace-dados-02', 'workspace-analytics-06'],
  'Provedor C': ['workspace-seguranca-03', 'workspace-compliance-07'],
  'Provedor D': ['workspace-infra-04', 'workspace-backup-08'],
}

// Lista achatada de todos os workspaces (usada no filtro da listagem).
export const WORKSPACES = Object.values(WORKSPACES_POR_PROVEDOR).flat()

// Lista achatada com o provedor de cada workspace — usada na tela "Vincular
// workspace" (seletor de duas colunas com o Centro de Custo atual de cada um).
export const TODOS_WORKSPACES = Object.entries(WORKSPACES_POR_PROVEDOR).flatMap(
  ([provedor, nomes]) => nomes.map((nome) => ({ id: `${provedor}::${nome}`, provedor, nome })),
)

/** Gera um "ID do workspace" fictício e estável a partir do nome (só cosmético). */
export const idDoWorkspace = (nome = '') => {
  let h = 0
  for (const ch of nome) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return `ws-${(h % 900000) + 100000}`
}

export const GERENTES = [
  { id: 'g1', nome: 'Ana Ribeiro', email: 'ana.ribeiro@exemplo.com' },
  { id: 'g2', nome: 'Bruno Carvalho', email: 'bruno.carvalho@exemplo.com' },
  { id: 'g3', nome: 'Camila Fontes', email: 'camila.fontes@exemplo.com' },
  { id: 'g4', nome: 'Diego Nunes', email: 'diego.nunes@exemplo.com' },
  { id: 'g5', nome: 'Elaine Prado', email: 'elaine.prado@exemplo.com' },
]

// E-mail padrão sugerido para receber alertas de consumo (pode ser editado/removido).
export const EMAIL_ALERTA_PADRAO = 'finops@exemplo.com'

// Opções do select "Alerta de consumo" em cada Vínculo.
export const ALERTA_OPCOES = [
  { value: 'nenhum', label: 'Sem alerta' },
  { value: 'padrao', label: 'Alerta padrão (75%, 85% e 90%)' },
]

export const alertaLabel = (value) =>
  ALERTA_OPCOES.find((o) => o.value === value)?.label ?? 'Sem alerta'

// Centro de Custo NÃO tem orçamento próprio — o orçamento vive nos Vínculos.
export const CENTROS_INICIAIS = [
  { id: 'cc-1', nome: 'Plataforma de Dados', codigo: 'PLAT-DATA-001', gerenteId: 'g1' },
  { id: 'cc-2', nome: 'Engenharia de Produto', codigo: 'ENG-PROD-002', gerenteId: 'g2' },
  { id: 'cc-3', nome: 'Segurança da Informação', codigo: 'SEC-INFO-003', gerenteId: 'g3' },
  { id: 'cc-4', nome: 'Operações de Nuvem', codigo: 'CLOUD-OPS-004', gerenteId: 'g4' },
]

export const STATUS_INICIATIVA = {
  ativa: { label: 'Ativa', color: '#2e7d32' },
  inativa: { label: 'Inativa', color: '#9e9e9e' },
  naoAssociada: { label: 'Não associada', color: '#ed6c02' },
}

export const statusIniciativaInfo = (status) =>
  STATUS_INICIATIVA[status] ?? STATUS_INICIATIVA.ativa

// Iniciativa é só identidade (nome/slug); orçamento e workspaces vivem nos Vínculos.
export const INICIATIVAS_INICIAIS = [
  { id: 'ini-1', slug: 'aceleracao-de-agentes-ia', status: 'ativa' },
  { id: 'ini-2', slug: 'migracao-lakehouse', status: 'ativa' },
  { id: 'ini-3', slug: 'observabilidade-unificada', status: 'inativa' },
  { id: 'ini-4', slug: 'reducao-de-custo-storage', status: 'naoAssociada' },
]

// Meses usados na grade de "Distribuição do orçamento" de cada Vínculo.
export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

/**
 * Cria a grade "orcamentoPorProvedor" de um Vínculo: uma distribuição de 12
 * meses para cada um dos 4 provedores genéricos. `valoresAnuais` (opcional)
 * mapeia provedor -> valor anual, dividido igualmente pelos 12 meses desse
 * provedor só para popular os dados de exemplo; por padrão todo mês começa
 * zerado.
 */
export const criarOrcamentoPorProvedor = (valoresAnuais = {}) =>
  Object.fromEntries(
    PROVEDORES.map((p) => {
      const anual = Number(valoresAnuais[p]) || 0
      if (!anual) return [p, MESES.map((mes) => ({ mes, valor: 0 }))]
      const centavos = Math.round(anual * 100)
      const base = Math.floor(centavos / 12)
      const resto = centavos - base * 12
      return [
        p,
        MESES.map((mes, i) => ({ mes, valor: (base + (i < resto ? 1 : 0)) / 100 })),
      ]
    }),
  )

// Vínculo = Iniciativa + Centro de Custo. O orçamento é definido por provedor
// ("orcamentoPorProvedor": uma grade de 12 meses para cada Provedor A-D) — a
// aba de cada provedor tem sua própria distribuição mensal. Quando
// "distribuicaoProporcional" está ligado, o total do vínculo é dividido
// proporcionalmente entre os provedores vinculados (pelo nº de workspaces de
// cada um) e, dentro de cada provedor, igualmente pelos 12 meses. Quando está
// desligado, cada mês de cada provedor é preenchido manualmente.
export const VINCULOS_INICIAIS = [
  {
    id: 'v-1',
    iniciativaId: 'ini-1',
    centroId: 'cc-1',
    workspaces: ['Provedor A::workspace-produto-01', 'Provedor B::workspace-dados-02'],
    distribuicaoProporcional: true,
    orcamentoPorProvedor: criarOrcamentoPorProvedor({ 'Provedor A': 82500, 'Provedor B': 82500 }),
    alerta: 'padrao',
    emailsAlerta: ['ana.ribeiro@exemplo.com', 'time-dados@exemplo.com'],
    emails: ['ana.ribeiro@exemplo.com', 'time-dados@exemplo.com'],
  },
  {
    id: 'v-2',
    iniciativaId: 'ini-1',
    centroId: 'cc-2',
    workspaces: ['Provedor C::workspace-seguranca-03'],
    distribuicaoProporcional: true,
    orcamentoPorProvedor: criarOrcamentoPorProvedor({ 'Provedor C': 30000 }),
    alerta: 'padrao',
    emailsAlerta: ['bruno.carvalho@exemplo.com', 'time-produto@exemplo.com'],
    emails: ['bruno.carvalho@exemplo.com', 'time-produto@exemplo.com'],
  },
  {
    id: 'v-3',
    iniciativaId: 'ini-2',
    centroId: 'cc-1',
    workspaces: ['Provedor A::workspace-marketing-05', 'Provedor D::workspace-infra-04'],
    distribuicaoProporcional: true,
    orcamentoPorProvedor: criarOrcamentoPorProvedor({ 'Provedor A': 51000, 'Provedor D': 51000 }),
    alerta: 'padrao',
    emailsAlerta: ['camila.fontes@exemplo.com', 'ana.ribeiro@exemplo.com'],
    emails: ['camila.fontes@exemplo.com', 'ana.ribeiro@exemplo.com'],
  },
  {
    id: 'v-4',
    iniciativaId: 'ini-3',
    centroId: 'cc-4',
    workspaces: ['Provedor C::workspace-compliance-07', 'Provedor B::workspace-analytics-06'],
    distribuicaoProporcional: false,
    orcamentoPorProvedor: {
      ...criarOrcamentoPorProvedor(),
      'Provedor C': [
        { mes: 'Janeiro', valor: 9000 },
        { mes: 'Fevereiro', valor: 9000 },
        { mes: 'Março', valor: 6000 },
        { mes: 'Abril', valor: 3000 },
        { mes: 'Maio', valor: 3000 },
        { mes: 'Junho', valor: 3000 },
        { mes: 'Julho', valor: 3000 },
        { mes: 'Agosto', valor: 1200 },
        { mes: 'Setembro', valor: 1200 },
        { mes: 'Outubro', valor: 1200 },
        { mes: 'Novembro', valor: 1200 },
        { mes: 'Dezembro', valor: 1200 },
      ],
      'Provedor B': [
        { mes: 'Janeiro', valor: 6000 },
        { mes: 'Fevereiro', valor: 6000 },
        { mes: 'Março', valor: 4000 },
        { mes: 'Abril', valor: 2000 },
        { mes: 'Maio', valor: 2000 },
        { mes: 'Junho', valor: 2000 },
        { mes: 'Julho', valor: 2000 },
        { mes: 'Agosto', valor: 800 },
        { mes: 'Setembro', valor: 800 },
        { mes: 'Outubro', valor: 800 },
        { mes: 'Novembro', valor: 800 },
        { mes: 'Dezembro', valor: 800 },
      ],
    },
    alerta: 'nenhum',
    emailsAlerta: ['diego.nunes@exemplo.com', 'observabilidade@exemplo.com'],
    emails: ['diego.nunes@exemplo.com', 'observabilidade@exemplo.com'],
  },
  {
    id: 'v-5',
    iniciativaId: 'ini-4',
    centroId: 'cc-4',
    workspaces: ['Provedor A::workspace-produto-01'],
    distribuicaoProporcional: true,
    orcamentoPorProvedor: criarOrcamentoPorProvedor({ 'Provedor A': 18000 }),
    alerta: 'padrao',
    emailsAlerta: ['diego.nunes@exemplo.com', 'finops@exemplo.com'],
    emails: ['diego.nunes@exemplo.com', 'finops@exemplo.com'],
  },
]

export const currency = (n) =>
  (Number(n) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Soma os 12 meses de orçamento de um Vínculo. */
export const somaMensal = (orcamentoMensal = []) =>
  orcamentoMensal.reduce((s, m) => s + (Number(m.valor) || 0), 0)

/** Soma dos 12 meses de UM provedor dentro de um Vínculo ("Soma total dos meses"). */
export const somaProvedor = (v, provedor) => somaMensal(v.orcamentoPorProvedor?.[provedor])

/** Valor total de um Vínculo ("Soma dos orçamentos"): soma de todos os provedores. */
export const valorVinculo = (v) =>
  PROVEDORES.reduce((s, p) => s + somaProvedor(v, p), 0)

/** Provedores presentes numa lista de workspaces selecionados ("Provedor::workspace"). */
export const provedoresDeWorkspaces = (workspaces = []) => [
  ...new Set(workspaces.map((w) => w.split('::')[0])),
]

/**
 * Divide um valor anual igualmente pelos 12 meses (modo "Distribuir automaticamente").
 * Trabalha em centavos e distribui o resto (de arredondar 1/12) nos primeiros
 * meses, para que a soma dos 12 meses bata exatamente com o valor anual —
 * em vez de arredondar 1/12 e repetir, o que deixaria a soma alguns
 * centavos a mais ou a menos que o valor informado.
 */
export const distribuirIgualmente = (orcamentoMensal = [], valorAnual) => {
  const totalCentavos = Math.round((Number(valorAnual) || 0) * 100)
  const baseCentavos = Math.floor(totalCentavos / 12)
  const resto = totalCentavos - baseCentavos * 12
  return orcamentoMensal.map((m, i) => ({
    ...m,
    valor: (baseCentavos + (i < resto ? 1 : 0)) / 100,
  }))
}

/**
 * "Distribuição proporcional automática": pega o total já lançado no Vínculo
 * (soma de todos os provedores) e redistribui — proporcional ao nº de
 * workspaces vinculados de cada provedor (ou igualmente entre os 4, se não
 * houver workspaces ainda) — e, dentro de cada provedor, igualmente pelos 12
 * meses. Trabalha em centavos com o método dos maiores restos para que a
 * soma das partes bata exatamente com o total original.
 */
export const distribuirProporcionalPorProvedor = (v) => {
  const totalCentavos = Math.round(valorVinculo(v) * 100)
  const contagem = PROVEDORES.map(
    (p) => v.workspaces.filter((w) => w.startsWith(`${p}::`)).length,
  )
  const somaContagem = contagem.reduce((a, b) => a + b, 0)
  const pesos =
    somaContagem > 0
      ? contagem.map((c) => c / somaContagem)
      : PROVEDORES.map(() => 1 / PROVEDORES.length)

  const brutos = pesos.map((w) => totalCentavos * w)
  const bases = brutos.map(Math.floor)
  const resto = totalCentavos - bases.reduce((a, b) => a + b, 0)
  const ordem = brutos
    .map((b, i) => ({ i, frac: b - bases[i] }))
    .sort((a, b) => b.frac - a.frac)
  for (let k = 0; k < resto; k += 1) bases[ordem[k].i] += 1

  return Object.fromEntries(
    PROVEDORES.map((p, i) => [
      p,
      distribuirIgualmente(v.orcamentoPorProvedor[p], bases[i] / 100),
    ]),
  )
}

/** Atualiza o valor de um mês específico na grade de um provedor. */
export const setValorMes = (orcamentoMensal = [], mes, valor) =>
  orcamentoMensal.map((m) => (m.mes === mes ? { ...m, valor } : m))

/** Cria os dados de um Vínculo em branco. */
export const novoVinculo = (uid, centroId = '') => ({
  id: uid('v'),
  centroId,
  // workspaces selecionados, id = "Provedor::workspace" (pode ter mais de um provedor)
  workspaces: [],
  // quando true, "distribuirProporcionalPorProvedor" divide o total atual entre
  // os provedores (pelo nº de workspaces de cada um) e pelos 12 meses de cada
  orcamentoPorProvedor: criarOrcamentoPorProvedor(),
  distribuicaoProporcional: false,
  // limites de alerta de consumo (%). O primeiro é o teto fixo do sistema.
  alertas: [
    { id: uid('a'), valor: 100, fixo: true },
    { id: uid('a'), valor: 70, fixo: false },
  ],
  // já vem com um destinatário padrão sugerido; o usuário pode trocar/adicionar
  emailsAlerta: [EMAIL_ALERTA_PADRAO],
  alerta: 'padrao',
  emails: [],
})
