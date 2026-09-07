// Provedores de cloud com rótulos 100% genéricos (sem marcas reais).
export const PROVEDORES = ['Provedor A', 'Provedor B', 'Provedor C', 'Provedor D']

// Contas de faturamento fictícias por provedor (para o seletor "Contas").
export const CONTAS_FATURAMENTO = {
  'Provedor A': ['conta-financas-01', 'conta-financas-02', 'conta-marketing-01'],
  'Provedor B': ['conta-produto-01', 'conta-dados-02'],
  'Provedor C': ['conta-seguranca-01', 'conta-seguranca-02', 'conta-infra-03'],
  'Provedor D': ['conta-infra-01', 'conta-backup-02'],
}

// Workspaces e serviços genéricos para o Vínculo (Provedor/Conta, Workspace, Serviço).
export const WORKSPACES = [
  'workspace-produto-01',
  'workspace-dados-02',
  'workspace-seguranca-03',
  'workspace-infra-04',
]

export const SERVICOS = [
  'Computação',
  'Armazenamento',
  'Banco de Dados',
  'Rede',
  'Observabilidade',
]

export const GERENTES = [
  { id: 'g1', nome: 'Ana Ribeiro', email: 'ana.ribeiro@exemplo.com' },
  { id: 'g2', nome: 'Bruno Carvalho', email: 'bruno.carvalho@exemplo.com' },
  { id: 'g3', nome: 'Camila Fontes', email: 'camila.fontes@exemplo.com' },
  { id: 'g4', nome: 'Diego Nunes', email: 'diego.nunes@exemplo.com' },
  { id: 'g5', nome: 'Elaine Prado', email: 'elaine.prado@exemplo.com' },
]

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

// Iniciativa é só identidade (nome/slug) + contagem de workspaces vinculados
// (só número — a jornada de Workspaces vive no produto real, fora do escopo).
// Vínculos carregam orçamento e alerta.
export const STATUS_INICIATIVA = {
  ativa: { label: 'Ativa', color: '#2e7d32' },
  pausada: { label: 'Pausada', color: '#f9a825' },
  encerrada: { label: 'Encerrada', color: '#9e9e9e' },
}

export const statusIniciativaInfo = (status) =>
  STATUS_INICIATIVA[status] ?? STATUS_INICIATIVA.ativa

export const INICIATIVAS_INICIAIS = [
  { id: 'ini-1', slug: 'aceleracao-de-agentes-ia', workspaces: 4, status: 'ativa' },
  { id: 'ini-2', slug: 'migracao-lakehouse', workspaces: 2, status: 'ativa' },
  { id: 'ini-3', slug: 'observabilidade-unificada', workspaces: 3, status: 'pausada' },
  { id: 'ini-4', slug: 'reducao-de-custo-storage', workspaces: 1, status: 'encerrada' },
]

// Vínculo = Iniciativa + Centro de Custo + (Cloud → Orçamento) + alerta + e-mails.
export const VINCULOS_INICIAIS = [
  {
    id: 'v-1',
    iniciativaId: 'ini-1',
    centroId: 'cc-1',
    workspace: 'workspace-produto-01',
    orcamentos: [
      { id: 'o-1', provedor: 'Provedor A', valor: 120000 },
      { id: 'o-2', provedor: 'Provedor B', valor: 45000 },
    ],
    alerta: 'padrao',
    emails: ['ana.ribeiro@exemplo.com', 'time-dados@exemplo.com'],
  },
  {
    id: 'v-2',
    iniciativaId: 'ini-1',
    centroId: 'cc-2',
    workspace: 'workspace-dados-02',
    orcamentos: [{ id: 'o-1', provedor: 'Provedor C', valor: 30000 }],
    alerta: 'padrao',
    emails: ['bruno.carvalho@exemplo.com', 'time-produto@exemplo.com'],
  },
  {
    id: 'v-3',
    iniciativaId: 'ini-2',
    centroId: 'cc-1',
    workspace: 'workspace-seguranca-03',
    orcamentos: [
      { id: 'o-1', provedor: 'Provedor A', valor: 80000 },
      { id: 'o-2', provedor: 'Provedor D', valor: 22000 },
    ],
    alerta: 'padrao',
    emails: ['camila.fontes@exemplo.com', 'ana.ribeiro@exemplo.com'],
  },
  {
    id: 'v-4',
    iniciativaId: 'ini-3',
    centroId: 'cc-4',
    workspace: 'workspace-infra-04',
    orcamentos: [
      { id: 'o-1', provedor: 'Provedor C', valor: 55000 },
      { id: 'o-2', provedor: 'Provedor B', valor: 15000 },
    ],
    alerta: 'nenhum',
    emails: ['diego.nunes@exemplo.com', 'observabilidade@exemplo.com'],
  },
  {
    id: 'v-5',
    iniciativaId: 'ini-4',
    centroId: 'cc-4',
    workspace: 'workspace-produto-01',
    orcamentos: [{ id: 'o-1', provedor: 'Provedor A', valor: 18000 }],
    alerta: 'padrao',
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

/**
 * Valor de um Vínculo para fins de total: usa o orçamento direcionado à
 * iniciativa quando definido (novo fluxo); cai para a soma dos orçamentos
 * por provedor como fallback (dados semente antigos).
 */
export const valorVinculo = (v) =>
  v.orcamentoDirecionado != null
    ? Number(v.orcamentoDirecionado) || 0
    : somaOrcamentos(v.orcamentos)

/** Cria os dados de um Vínculo em branco. */
export const novoVinculo = (uid, centroId = '') => ({
  id: uid('v'),
  centroId,
  // contas de faturamento selecionadas, id = "Provedor::conta" (pode ter mais de um provedor)
  contas: [],
  // workspaces selecionados (pode ter mais de um)
  workspaces: [],
  // orçamento (R$) direcionado a esta iniciativa a partir do centro de custo pagador
  orcamentoDirecionado: 0,
  servico: '',
  // limites de alerta de consumo (%). O primeiro é o teto fixo do sistema.
  alertas: [
    { id: uid('a'), valor: 100, fixo: true },
    { id: uid('a'), valor: 70, fixo: false },
  ],
  emailsAlerta: [],
  orcamentos: [],
  alerta: 'padrao',
  emails: [],
})

/** Deriva a lista de orçamentos (por provedor) a partir das contas selecionadas no Vínculo. */
export const orcamentosDeContas = (uid, contas = []) => {
  const provedores = [...new Set(contas.map((c) => c.split('::')[0]))]
  return provedores.map((provedor) => ({ id: uid('o'), provedor, valor: 0 }))
}
