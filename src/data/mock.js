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
  pausada: { label: 'Pausada', color: '#f9a825' },
  encerrada: { label: 'Encerrada', color: '#9e9e9e' },
}

export const statusIniciativaInfo = (status) =>
  STATUS_INICIATIVA[status] ?? STATUS_INICIATIVA.ativa

// Iniciativa é só identidade (nome/slug); orçamento e workspaces vivem nos Vínculos.
export const INICIATIVAS_INICIAIS = [
  { id: 'ini-1', slug: 'aceleracao-de-agentes-ia', status: 'ativa' },
  { id: 'ini-2', slug: 'migracao-lakehouse', status: 'ativa' },
  { id: 'ini-3', slug: 'observabilidade-unificada', status: 'pausada' },
  { id: 'ini-4', slug: 'reducao-de-custo-storage', status: 'encerrada' },
]

// Vínculo = Iniciativa + Centro de Custo. Dentro de um Vínculo, o orçamento é
// aberto por provedor (orcamentos: [{provedor, valor}]) — os workspaces
// selecionados de cada provedor consomem o orçamento daquele provedor.
// Total do Vínculo = soma dos orçamentos por provedor (somaOrcamentos).
export const VINCULOS_INICIAIS = [
  {
    id: 'v-1',
    iniciativaId: 'ini-1',
    centroId: 'cc-1',
    workspaces: ['Provedor A::workspace-produto-01', 'Provedor B::workspace-dados-02'],
    orcamentos: [
      { id: 'o-1', provedor: 'Provedor A', valor: 120000 },
      { id: 'o-2', provedor: 'Provedor B', valor: 45000 },
    ],
    alerta: 'padrao',
    emailsAlerta: ['ana.ribeiro@exemplo.com', 'time-dados@exemplo.com'],
    emails: ['ana.ribeiro@exemplo.com', 'time-dados@exemplo.com'],
  },
  {
    id: 'v-2',
    iniciativaId: 'ini-1',
    centroId: 'cc-2',
    workspaces: ['Provedor C::workspace-seguranca-03'],
    orcamentos: [{ id: 'o-1', provedor: 'Provedor C', valor: 30000 }],
    alerta: 'padrao',
    emailsAlerta: ['bruno.carvalho@exemplo.com', 'time-produto@exemplo.com'],
    emails: ['bruno.carvalho@exemplo.com', 'time-produto@exemplo.com'],
  },
  {
    id: 'v-3',
    iniciativaId: 'ini-2',
    centroId: 'cc-1',
    workspaces: ['Provedor A::workspace-marketing-05', 'Provedor D::workspace-infra-04'],
    orcamentos: [
      { id: 'o-1', provedor: 'Provedor A', valor: 80000 },
      { id: 'o-2', provedor: 'Provedor D', valor: 22000 },
    ],
    alerta: 'padrao',
    emailsAlerta: ['camila.fontes@exemplo.com', 'ana.ribeiro@exemplo.com'],
    emails: ['camila.fontes@exemplo.com', 'ana.ribeiro@exemplo.com'],
  },
  {
    id: 'v-4',
    iniciativaId: 'ini-3',
    centroId: 'cc-4',
    workspaces: ['Provedor C::workspace-compliance-07', 'Provedor B::workspace-analytics-06'],
    orcamentos: [
      { id: 'o-1', provedor: 'Provedor C', valor: 55000 },
      { id: 'o-2', provedor: 'Provedor B', valor: 15000 },
    ],
    alerta: 'nenhum',
    emailsAlerta: ['diego.nunes@exemplo.com', 'observabilidade@exemplo.com'],
    emails: ['diego.nunes@exemplo.com', 'observabilidade@exemplo.com'],
  },
  {
    id: 'v-5',
    iniciativaId: 'ini-4',
    centroId: 'cc-4',
    workspaces: ['Provedor A::workspace-produto-01'],
    orcamentos: [{ id: 'o-1', provedor: 'Provedor A', valor: 18000 }],
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

export const somaOrcamentos = (orcamentos = []) =>
  orcamentos.reduce((s, o) => s + (Number(o.valor) || 0), 0)

/** Valor total de um Vínculo: soma dos orçamentos por provedor. */
export const valorVinculo = (v) => somaOrcamentos(v.orcamentos)

/** Provedores presentes numa lista de workspaces selecionados ("Provedor::workspace"). */
export const provedoresDeWorkspaces = (workspaces = []) => [
  ...new Set(workspaces.map((w) => w.split('::')[0])),
]

/**
 * Mantém a lista de orçamentos por provedor sincronizada com os workspaces
 * selecionados: adiciona uma linha (valor 0) pra provedor novo e remove a
 * linha de provedor que não tem mais nenhum workspace selecionado —
 * preservando o valor já digitado nos provedores que continuam.
 */
export const sincronizarOrcamentos = (uid, orcamentos = [], workspaces = []) => {
  const provedores = provedoresDeWorkspaces(workspaces)
  const mantidos = orcamentos.filter((o) => provedores.includes(o.provedor))
  const novos = provedores
    .filter((p) => !mantidos.some((o) => o.provedor === p))
    .map((provedor) => ({ id: uid('o'), provedor, valor: 0 }))
  return [...mantidos, ...novos]
}

export const setOrcamentoProvedor = (orcamentos = [], provedor, valor) =>
  orcamentos.map((o) => (o.provedor === provedor ? { ...o, valor } : o))

/** Cria os dados de um Vínculo em branco. */
export const novoVinculo = (uid, centroId = '') => ({
  id: uid('v'),
  centroId,
  // workspaces selecionados, id = "Provedor::workspace" (pode ter mais de um provedor)
  workspaces: [],
  // orçamento (R$) aberto por provedor, sincronizado com os workspaces selecionados
  orcamentos: [],
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
