// Dados fictícios para a tela "Orçamento, consumo e ofensores" > aba Consumo.
// Tudo em memória, valores genéricos — mesma convenção do restante do protótipo
// (ver mock.js: PROVEDORES = 'Provedor A/B/C/D', sem marcas reais).
import { PROVEDORES } from './mock.js'

export const PERIODO_CONSUMO_PADRAO = '16/06/2026 - 17/07/2026'

// Opções genéricas para os filtros que ainda não têm um modelo de dados
// próprio no protótipo (rateio, hierarquias, serviço).
export const RATEIO_OPCOES = [
  { value: 'direto', label: 'Rateio direto' },
  { value: 'proporcional', label: 'Rateio proporcional' },
  { value: 'nenhum', label: 'Sem rateio' },
]

export const HIERARQUIA_OPCOES = [
  { value: 'departamento', label: 'Hierarquia por Departamento' },
  { value: 'projeto', label: 'Hierarquia por Projeto' },
  { value: 'fornecedor', label: 'Hierarquia por Fornecedor' },
]

export const SERVICO_OPCOES = [
  { value: 'armazenamento', label: 'Armazenamento' },
  { value: 'computacao', label: 'Computação' },
  { value: 'banco-de-dados', label: 'Banco de dados' },
  { value: 'rede', label: 'Rede' },
  { value: 'observabilidade', label: 'Observabilidade' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'mensageria', label: 'Mensageria' },
]

// Peso fictício de cada Centro de Custo no consumo total — usado só para
// recalcular os cards de forma plausível quando o filtro "Centros de custo"
// está ativo (soma = 1).
export const PESO_CONSUMO_POR_CENTRO = {
  'cc-1': 0.38,
  'cc-2': 0.16,
  'cc-3': 0.27,
  'cc-4': 0.19,
}

// Cards de KPI (linha do topo). "total" é derivado dos demais, igual ao
// produto real: recursos + suporte + compromissos - créditos.
export const KPI_BASE = {
  recursos: 1847622.3,
  suporte: 2180.4,
  compromissos: 0,
  creditos: 8940.15,
}
export const kpiTotal = (k) => k.recursos + k.suporte + k.compromissos - k.creditos

/** Aplica um fator de escala (0-1] às métricas, mantendo "compromissos" zerado. */
export const escalarKpi = (fator) => ({
  recursos: KPI_BASE.recursos * fator,
  suporte: KPI_BASE.suporte * fator,
  compromissos: KPI_BASE.compromissos,
  creditos: KPI_BASE.creditos * fator,
})

// --- Séries dos gráficos de linha (valores relativos 0-100, só para desenhar
// o path do SVG — nada aqui representa consumo real). ---

export const DATAS_PROVEDORES = [
  '16/jun', '19/jun', '22/jun', '25/jun', '28/jun', '1/jul',
  '4/jul', '7/jul', '10/jul', '13/jul', '16/jul',
]

export const SERIE_PROVEDORES = [
  { key: 'provedorA', label: 'Provedor A', color: '#3B82F6',
    pontos: [8, 9, 8, 10, 9, 11, 16, 92, 22, 78, 14] },
  { key: 'provedorB', label: 'Provedor B', color: '#EF4444',
    pontos: [6, 6, 7, 6, 7, 14, 10, 9, 8, 8, 7] },
  { key: 'provedorC', label: 'Provedor C', color: '#F59E0B',
    pontos: [4, 5, 4, 5, 5, 9, 7, 6, 6, 5, 5] },
  { key: 'provedorD', label: 'Provedor D', color: '#22C55E',
    pontos: [3, 3, 4, 3, 4, 6, 5, 4, 4, 4, 3] },
]

export const DATAS_DETALHE = ['16/jun', '21/jun', '26/jun', '1/jul', '6/jul', '11/jul', '16/jul']

const detalheSerie = (picos, base = 4) =>
  DATAS_DETALHE.map((_, i) => (picos[i] != null ? picos[i] : base))

export const painelWorkspace = {
  titulo: 'Workspace',
  series: [
    { key: 'principal', color: '#3B82F6', pontos: detalheSerie([5, 6, 5, 8, 82, 10, 6]) },
    { key: 'sec1', color: '#F59E0B', pontos: detalheSerie([3, 3, 4, 3, 5, 4, 3]) },
    { key: 'sec2', color: '#8B5CF6', pontos: detalheSerie([2, 2, 3, 2, 3, 3, 2]) },
  ],
  donut: [
    { label: 'workspace-produto-01', color: '#3B82F6', valor: 21.65 },
    { label: 'workspace-marketing-05', color: '#F59E0B', valor: 11.26 },
    { label: 'workspace-dados-02', color: '#A855F7', valor: 4.79 },
    { label: 'workspace-analytics-06', color: '#EC4899', valor: 4.0 },
    { label: 'workspace-seguranca-03', color: '#EAB308', valor: 2.86 },
    { label: 'workspace-infra-04', color: '#10B981', valor: 3.43 },
    { label: 'workspace-backup-08', color: '#F472B6', valor: 7.16 },
    { label: 'Outros', color: '#9CA3AF', valor: 44.85 },
  ],
}

export const painelServico = {
  titulo: 'Serviço',
  series: [
    { key: 'principal', color: '#F59E0B', pontos: detalheSerie([4, 4, 5, 4, 44, 4, 22], 3) },
    { key: 'sec1', color: '#3B82F6', pontos: detalheSerie([2, 2, 3, 2, 3, 3, 2]) },
  ],
  donut: [
    { label: 'Armazenamento', color: '#3B82F6', valor: 17.17 },
    { label: 'Repositório de código', color: '#F472B6', valor: 11.95 },
    { label: 'Banco de dados', color: '#EC4899', valor: 11.26 },
    { label: 'Computação', color: '#10B981', valor: 7.61 },
    { label: 'Cache gerenciado', color: '#A855F7', valor: 3.28 },
    { label: 'Banco gerenciado', color: '#EAB308', valor: 2.68 },
    { label: 'App Service', color: '#60A5FA', valor: 2.56 },
    { label: 'Rede', color: '#D1D5DB', valor: 2.85 },
    { label: 'Motor de computação', color: '#FB7185', valor: 2.03 },
    { label: 'Outros (148)', color: '#6B7280', valor: 38.61 },
  ],
}

export const painelSku = {
  titulo: 'SKU',
  series: [
    { key: 'principal', color: '#3B82F6', pontos: detalheSerie([3, 3, 4, 3, 62, 6, 40], 2) },
    { key: 'sec1', color: '#F59E0B', pontos: detalheSerie([4, 3, 4, 4, 4, 3, 3]) },
  ],
  donut: [
    { label: 'Unidade de usuário', color: '#3B82F6', valor: 13.43 },
    { label: 'Núcleo virtual', color: '#F472B6', valor: 10.51 },
    { label: 'Instância BD Enterprise', color: '#A855F7', valor: 4.27 },
    { label: 'Disco padrão 30', color: '#60A5FA', valor: 2.68 },
    { label: 'Camada Standard X', color: '#EAB308', valor: 2.55 },
    { label: 'Transferência de saída', color: '#FCD34D', valor: 2.09 },
    { label: 'Disco premium 40', color: '#38BDF8', valor: 1.48 },
    { label: 'VPN Gateway 2AZ', color: '#F97316', valor: 1.1 },
    { label: 'Armazenamento frio', color: '#FB7185', valor: 4.5 },
    { label: 'Outros (1559)', color: '#6B7280', valor: 57.36 },
  ],
}

export const ANOMALIAS = [
  'Transferência de saída — Zona 2',
  'Operações de gravação — armaz. frio',
  'Operações gerais',
]

export { PROVEDORES }
