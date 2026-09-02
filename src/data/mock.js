// Provedores de cloud com rótulos 100% genéricos (sem marcas reais).
export const PROVEDORES = ['Provedor A', 'Provedor B', 'Provedor C', 'Provedor D']

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

// Iniciativa é só identidade (nome/slug). Vínculos carregam orçamento e alerta.
export const INICIATIVAS_INICIAIS = [
  { id: 'ini-1', slug: 'aceleracao-de-agentes-ia' },
  { id: 'ini-2', slug: 'migracao-lakehouse' },
  { id: 'ini-3', slug: 'observabilidade-unificada' },
  { id: 'ini-4', slug: 'reducao-de-custo-storage' },
]

// Vínculo = Iniciativa + Centro de Custo + (Cloud → Orçamento) + alerta + e-mails.
export const VINCULOS_INICIAIS = [
  {
    id: 'v-1',
    iniciativaId: 'ini-1',
    centroId: 'cc-1',
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
    orcamentos: [{ id: 'o-1', provedor: 'Provedor C', valor: 30000 }],
    alerta: 'padrao',
    emails: ['bruno.carvalho@exemplo.com', 'time-produto@exemplo.com'],
  },
  {
    id: 'v-3',
    iniciativaId: 'ini-2',
    centroId: 'cc-1',
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

/** Cria os dados de um Vínculo em branco. */
export const novoVinculo = (uid, centroId = '') => ({
  id: uid('v'),
  centroId,
  orcamentos: [{ id: uid('o'), provedor: 'Provedor A', valor: 0 }],
  alerta: 'padrao',
  emails: [],
})
