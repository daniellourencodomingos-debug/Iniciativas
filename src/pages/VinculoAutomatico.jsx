import { useState } from 'react'
import { PageHeader } from '../components/Layout.jsx'
import { Field, TextInput, TextArea, Select } from '../components/fields.jsx'
import Stepper from '../components/Stepper.jsx'
import Toast from '../components/Toast.jsx'
import { Icon } from '../components/icons.jsx'
import { useApp } from '../store/AppContext.jsx'
import {
  METODOS_HTTP,
  CONTENT_TYPES,
  novoEndpointVinculo,
  novaAutenticacaoVinculo,
} from '../data/mock.js'

const STEPS = ['Instruções', 'Busca de vínculo', 'Tipo de API', 'Busca de Autenticação', 'Revisar']

/**
 * Jornada de "Vínculo automático" — identifica Centro de Custo e Iniciativa
 * (e opcionalmente Workspace) direto de uma fonte externa via API, sem
 * cadastro manual nem planilha. Reflete o Figma "Vínculo de Iniciativas e
 * centro de custo", com uma correção: a etapa Revisar aqui também mostra o
 * mapeamento de Iniciativa (no Figma original a etapa Revisar só listava
 * Centro de Custo e Workspace, mesmo a Iniciativa sendo capturada na etapa
 * "Busca de vínculo").
 */
export default function VinculoAutomatico() {
  const { vinculoAutomatico, dispatch, uid } = useApp()
  const editing = Boolean(vinculoAutomatico)

  const [step, setStep] = useState(editing ? 1 : 0)
  const [endpoints, setEndpoints] = useState(() =>
    editing && vinculoAutomatico.endpoints?.length
      ? vinculoAutomatico.endpoints.map((e) => ({ ...e }))
      : [novoEndpointVinculo(uid)],
  )
  const [endpointAtivo, setEndpointAtivo] = useState(0)
  const [apiPrivada, setApiPrivada] = useState(editing ? vinculoAutomatico.apiPrivada : null)
  const [auth, setAuth] = useState(() =>
    editing && vinculoAutomatico.autenticacao
      ? { ...vinculoAutomatico.autenticacao }
      : novaAutenticacaoVinculo(),
  )
  const [toastOpen, setToastOpen] = useState(false)

  const ep = endpoints[endpointAtivo]
  const setEp = (patch) =>
    setEndpoints((list) => list.map((e, i) => (i === endpointAtivo ? { ...e, ...patch } : e)))

  const addEndpoint = () =>
    setEndpoints((list) => {
      const novo = novoEndpointVinculo(uid)
      novo.nome = `Endpoint ${String(list.length + 1).padStart(2, '0')}`
      setEndpointAtivo(list.length)
      return [...list, novo]
    })

  const podeAvancarBusca = ep.url.trim() && ep.caminhoCentroId.trim() && ep.caminhoCentroNome.trim()
  const podeAvancarTipo = apiPrivada !== null
  const podeAvancarAuth = apiPrivada === false || (auth.url.trim() && auth.caminhoToken.trim())

  const avancar = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  const voltar = () => setStep((s) => Math.max(0, s - 1))

  const salvar = () => {
    dispatch({
      type: 'SAVE_VINCULO_AUTOMATICO',
      payload: {
        apiPrivada,
        endpoints,
        autenticacao: apiPrivada ? auth : null,
        atualizadoEm: new Date().toISOString().slice(0, 10),
      },
    })
    setToastOpen(true)
  }

  return (
    <>
      <PageHeader
        title={editing ? 'Editar vínculo automático' : 'Novo vínculo automático'}
        subtitle="Identifica Centro de Custo e Iniciativa automaticamente a partir de uma fonte externa via API — sem cadastro manual e sem planilha."
      />

      <div className="mb-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      {step === 0 && <PassoInstrucoes onNext={() => setStep(1)} />}

      {step === 1 && (
        <PassoBuscaDeVinculo
          endpoints={endpoints}
          endpointAtivo={endpointAtivo}
          setEndpointAtivo={setEndpointAtivo}
          addEndpoint={addEndpoint}
          ep={ep}
          setEp={setEp}
          podeAvancar={podeAvancarBusca}
          onBack={voltar}
          onNext={avancar}
        />
      )}

      {step === 2 && (
        <PassoTipoDeApi
          apiPrivada={apiPrivada}
          setApiPrivada={setApiPrivada}
          podeAvancar={podeAvancarTipo}
          onBack={voltar}
          onNext={() => setStep(apiPrivada ? 3 : 4)}
        />
      )}

      {step === 3 && (
        <PassoBuscaDeAutenticacao
          auth={auth}
          setAuth={setAuth}
          podeAvancar={podeAvancarAuth}
          onBack={voltar}
          onNext={avancar}
        />
      )}

      {step === 4 && (
        <PassoRevisar
          endpoints={endpoints}
          apiPrivada={apiPrivada}
          auth={auth}
          onBack={() => setStep(apiPrivada ? 3 : 2)}
          onSalvar={salvar}
        />
      )}

      <Toast open={toastOpen} onClose={() => setToastOpen(false)}>
        Vínculo automático salvo. A identificação e o vínculo dos centros de custo e iniciativas podem levar até 24 horas.
      </Toast>
    </>
  )
}

function Card({ title, description, children }) {
  return (
    <section className="rounded-card border border-hairline bg-white">
      {(title || description) && (
        <header className="border-b border-hairline px-5 py-4">
          {title && <h2 className="text-base font-semibold text-gray-900">{title}</h2>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </header>
      )}
      <div className="space-y-5 px-5 py-5">{children}</div>
    </section>
  )
}

function StepFooter({ onBack, onNext, nextLabel = 'Próximo', podeAvancar = true, hideBack = false }) {
  return (
    <div className="mt-5 flex items-center justify-between">
      {!hideBack ? (
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
          <Icon.ArrowLeft width={15} height={15} /> Anterior
        </button>
      ) : (
        <span />
      )}
      <button
        onClick={onNext}
        disabled={!podeAvancar}
        className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel} {nextLabel === 'Próximo' && <Icon.ArrowRight width={15} height={15} />}
      </button>
    </div>
  )
}

function PassoInstrucoes({ onNext }) {
  return (
    <Card title="Instruções para busca de vínculo">
      <ol className="space-y-4 text-sm text-gray-700">
        <li>
          <p className="font-semibold text-gray-900">1. Selecione a Organização</p>
          <p>Defina a qual organização este vínculo de Centros de Custo pertence. Ela será a base para todos os endpoints que você adicionar nesta tela.</p>
        </li>
        <li>
          <p className="font-semibold text-gray-900">2. Informe a URL de Busca</p>
          <p>Insira o endpoint da API que contém a relação entre Centros de Custo, Iniciativas e Workspaces.</p>
        </li>
        <li>
          <p className="font-semibold text-gray-900">3. Método HTTP</p>
          <p>Selecione o método (GET, POST etc.) utilizado para realizar esta consulta.</p>
        </li>
        <li>
          <p className="font-semibold text-gray-900">4. Headers da Requisição</p>
          <p>Configure os cabeçalhos necessários para a chamada. Selecione o Content-Type adequado para a sua API.</p>
        </li>
        <li>
          <p className="font-semibold text-gray-900">5. Payload da Requisição (Opcional)</p>
          <p>Se necessário, insira o corpo da requisição (Body) em formato JSON. Se a consulta não exigir dados enviados, deixe este campo vazio.</p>
        </li>
        <li>
          <p className="font-semibold text-gray-900">6. Mapeamento de Dados (JSON Path)</p>
          <p>Indique o caminho para extrair os dados do retorno da API. Use a notação de ponto para campos aninhados (Ex.: resultado.projeto_id).</p>
          <p className="mt-1"><strong>Caminho da lista de itens:</strong> chave do JSON que envelopa a lista com as informações.</p>
          <p><strong>Identificador do Centro de Custo:</strong> caminho para o campo de custo.</p>
          <p><strong>Identificador para o nome do Centro de Custo:</strong> caminho para o nome do Centro de Custo.</p>
          <p><strong>Identificador do Workspace:</strong> caminho para o campo do workspace.</p>
          <p><strong>Identificador da Iniciativa:</strong> caminho para o campo de iniciativa vinculado ao mesmo registro — o vínculo com a Iniciativa é feito automaticamente junto com o do Centro de Custo.</p>
        </li>
        <li>
          <p className="font-semibold text-gray-900">7. Configuração de Paginação (Opcional)</p>
          <p>Se a API for paginada, configure os campos abaixo: <strong>Caminho do token (JSON Path)</strong> e <strong>Parâmetro da URL (Query Param)</strong>.</p>
        </li>
      </ol>
      <StepFooter hideBack onNext={onNext} podeAvancar />
    </Card>
  )
}

function HeadersAdicionais({ value, onChange }) {
  const set = (i, patch) => onChange(value.map((h, idx) => (idx === i ? { ...h, ...patch } : h)))
  const add = () => onChange([...value, { key: '', value: '' }])
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i))
  return (
    <div className="space-y-2">
      {value.map((h, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={h.key}
            onChange={(e) => set(i, { key: e.target.value })}
            placeholder="Key"
            className="rounded border border-gray-300"
          />
          <TextInput
            value={h.value}
            onChange={(e) => set(i, { value: e.target.value })}
            placeholder="Value"
            className="rounded border border-gray-300"
          />
          <button onClick={() => remove(i)} className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-500">
            <Icon.X width={14} height={14} />
          </button>
        </div>
      ))}
      <button onClick={add} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
        <Icon.Plus width={13} height={13} /> Adicionar header
      </button>
    </div>
  )
}

function ApiReturnBox({ children }) {
  return (
    <pre className="overflow-x-auto rounded-md bg-[#0B2D4D] p-3 text-xs leading-relaxed text-blue-100">{children}</pre>
  )
}

function PassoBuscaDeVinculo({ endpoints, endpointAtivo, setEndpointAtivo, addEndpoint, ep, setEp, podeAvancar, onBack, onNext }) {
  return (
    <Card
      title="Busca de vínculo"
      description="Configure os parâmetros para automatizar a busca de vínculos diretamente de fontes externas. Se necessário, você pode cadastrar mais de um endpoint de busca para a mesma organização utilizando o botão de adição."
    >
      <div className="flex items-center gap-1 border-b border-hairline pb-2">
        {endpoints.map((e, i) => (
          <button
            key={e.id}
            onClick={() => setEndpointAtivo(i)}
            className={`rounded-t-md px-3 py-1.5 text-sm font-medium ${
              i === endpointAtivo ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {e.nome}
          </button>
        ))}
        <button onClick={addEndpoint} title="Adicionar endpoint" className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand">
          <Icon.Plus width={16} height={16} />
        </button>
      </div>

      <Field label="Organização" required>
        <TextInput value={ep.organizacao} onChange={(e) => setEp({ organizacao: e.target.value })} placeholder="Ex.: Empresa X" />
      </Field>

      <div className="grid grid-cols-[1fr_180px] gap-4">
        <Field label="URL" required>
          <TextInput value={ep.url} onChange={(e) => setEp({ url: e.target.value })} placeholder="https://api.exemplo.com/custos" />
        </Field>
        <Field label="Método HTTP" required>
          <Select value={ep.metodo} onChange={(e) => setEp({ metodo: e.target.value })}>
            {METODOS_HTTP.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Header">
          <Select value={ep.contentType} onChange={(e) => setEp({ contentType: e.target.value })}>
            {CONTENT_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Headers adicionais">
          <HeadersAdicionais value={ep.headersAdicionais} onChange={(v) => setEp({ headersAdicionais: v })} />
        </Field>
      </div>

      <Field label="Body" hint="JSON">
        <TextArea value={ep.body} onChange={(e) => setEp({ body: e.target.value })} rows={4} className="font-mono" />
      </Field>

      <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <p className="font-semibold">Retorno da API</p>
        <p className="mt-0.5 text-blue-800">Abaixo está uma representação do retorno da sua API. Identifique quais chaves contêm os dados de Centro de Custo, Iniciativa e Workspace para realizar o mapeamento.</p>
      </div>
      <ApiReturnBox>{`{
  "status": "success",
  "data": [{
    "centro_custo": "CC-123",
    "nome_centro_custo": "Departamento TI",
    "iniciativa": "INIT-789",
    "workspace": "WS-456"
  }]
}`}</ApiReturnBox>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Identificador da lista de itens (JSON Path)" required hint="Exemplo: data">
          <TextInput value={ep.caminhoLista} onChange={(e) => setEp({ caminhoLista: e.target.value })} />
        </Field>
        <Field label="Identificador do Centro de custo (JSON Path)" required hint="Exemplo: centro_custo">
          <TextInput value={ep.caminhoCentroId} onChange={(e) => setEp({ caminhoCentroId: e.target.value })} />
        </Field>
        <Field label="Nome do Centro de Custo (JSON Path)" required hint="Exemplo: nome_centro_custo">
          <TextInput value={ep.caminhoCentroNome} onChange={(e) => setEp({ caminhoCentroNome: e.target.value })} />
        </Field>
        <Field label="Identificador do Workspace (JSON Path)" hint="Exemplo: workspace">
          <TextInput value={ep.caminhoWorkspace} onChange={(e) => setEp({ caminhoWorkspace: e.target.value })} />
        </Field>
      </div>

      <div className="border-t border-hairline pt-4">
        <p className="text-sm font-semibold text-gray-900">Mapeamento de Iniciativa</p>
        <p className="mt-0.5 text-sm text-gray-500">
          Use estes campos para localizar e vincular automaticamente a Iniciativa quando a mesma fonte externa fornecer esse dado — o vínculo com a Iniciativa é feito junto com o do Centro de Custo, sem etapa separada.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <Field label="Identificador da Iniciativa (JSON Path)" hint="Exemplo: iniciativa">
            <TextInput value={ep.caminhoIniciativaId} onChange={(e) => setEp({ caminhoIniciativaId: e.target.value })} />
          </Field>
          <Field label="Nome da Iniciativa (JSON Path)" hint="Exemplo: nome_iniciativa">
            <TextInput value={ep.caminhoIniciativaNome} onChange={(e) => setEp({ caminhoIniciativaNome: e.target.value })} />
          </Field>
        </div>
      </div>

      <div className="border-t border-hairline pt-4">
        <p className="text-sm font-semibold text-gray-900">Paginação</p>
        <p className="mt-0.5 text-sm text-gray-500">Se a sua API possui paginação, configure os campos abaixo para que a plataforma navegue automaticamente por todas as páginas de resultados.</p>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <Field label="Caminho do token (JSON Path)" hint="Exemplo: pagination.next_page">
            <TextInput value={ep.caminhoPaginacaoToken} onChange={(e) => setEp({ caminhoPaginacaoToken: e.target.value })} />
          </Field>
          <Field label="Nome do Parâmetro (Query Param)" hint="Exemplo: page">
            <TextInput value={ep.paginacaoQueryParam} onChange={(e) => setEp({ paginacaoQueryParam: e.target.value })} />
          </Field>
        </div>
      </div>

      <StepFooter onBack={onBack} onNext={onNext} podeAvancar={podeAvancar} />
    </Card>
  )
}

function PassoTipoDeApi({ apiPrivada, setApiPrivada, podeAvancar, onBack, onNext }) {
  const Opt = ({ value, title, desc }) => (
    <button
      onClick={() => setApiPrivada(value)}
      className={`w-full rounded-md border px-4 py-3 text-left ${
        apiPrivada === value ? 'border-brand bg-brand/5' : 'border-hairline hover:bg-gray-50'
      }`}
    >
      <span className="flex items-center gap-2">
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
            apiPrivada === value ? 'border-brand' : 'border-gray-300'
          }`}
        >
          {apiPrivada === value && <span className="h-2 w-2 rounded-full bg-brand" />}
        </span>
        <span className="text-sm font-semibold text-gray-900">{title}</span>
      </span>
      <p className="ml-6 mt-0.5 text-sm text-gray-500">{desc}</p>
    </button>
  )
  return (
    <Card title="Tipo de API" description="A API de destino exige autenticação?">
      <div className="space-y-3">
        <Opt value={false} title="Não, é uma API pública" desc="O endpoint está aberto e não exige credenciais de segurança ou autenticação prévia para a coleta dos dados." />
        <Opt value={true} title="Sim, é uma API privada" desc="O endpoint exige um token dinâmico ou estático nos cabeçalhos (headers) da requisição para liberar o acesso aos dados." />
      </div>
      <StepFooter onBack={onBack} onNext={onNext} podeAvancar={podeAvancar} />
    </Card>
  )
}

function PassoBuscaDeAutenticacao({ auth, setAuth, podeAvancar, onBack, onNext }) {
  return (
    <Card
      title="Busca de autenticação"
      description="Insira os parâmetros necessários para que a plataforma realize a autenticação automática na API externa. Esta etapa é fundamental para APIs privadas, garantindo a geração de tokens dinâmicos que dão acesso seguro aos dados de custos sem expor credenciais estáticas."
    >
      <div className="grid grid-cols-[1fr_180px] gap-4">
        <Field label="URL" required>
          <TextInput value={auth.url} onChange={(e) => setAuth({ ...auth, url: e.target.value })} placeholder="https://auth.exemplo.com/oauth/token" />
        </Field>
        <Field label="Método HTTP" required>
          <Select value={auth.metodo} onChange={(e) => setAuth({ ...auth, metodo: e.target.value })}>
            {METODOS_HTTP.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Header">
          <Select value={auth.contentType} onChange={(e) => setAuth({ ...auth, contentType: e.target.value })}>
            {CONTENT_TYPES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Headers adicionais">
          <HeadersAdicionais value={auth.headersAdicionais} onChange={(v) => setAuth({ ...auth, headersAdicionais: v })} />
        </Field>
      </div>

      <Field label="Body" hint="JSON — Ex.: ID, client secret ou password. Deixe vazio se não for necessário.">
        <TextArea value={auth.body} onChange={(e) => setAuth({ ...auth, body: e.target.value })} rows={4} className="font-mono" />
      </Field>

      <div className="rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <p className="font-semibold">Retorno da API</p>
        <p className="mt-0.5 text-blue-800">Abaixo está uma representação do retorno da sua API de segurança. Identifique qual chave contém o token de acesso para realizar o mapeamento.</p>
      </div>
      <ApiReturnBox>{`{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "expires_in": 3600
}`}</ApiReturnBox>

      <Field label="Chave do token (JSON Path)" required hint="Exemplo: access_token">
        <TextInput value={auth.caminhoToken} onChange={(e) => setAuth({ ...auth, caminhoToken: e.target.value })} />
      </Field>
      <Field label="Header" hint="Chave do header na requisição">
        <TextInput value={auth.headerDestino} onChange={(e) => setAuth({ ...auth, headerDestino: e.target.value })} />
      </Field>
      <Field label="Formatação do Token (JSON Path)" required hint="Ex.: Bearer {token}">
        <TextInput value={auth.formatoToken} onChange={(e) => setAuth({ ...auth, formatoToken: e.target.value })} />
      </Field>

      <StepFooter onBack={onBack} onNext={onNext} podeAvancar={podeAvancar} nextLabel="Próximo" />
    </Card>
  )
}

function Resumo({ label, value }) {
  return (
    <p className="text-sm">
      <span className="font-semibold text-gray-900">{label}: </span>
      <span className="text-gray-600">{value || '—'}</span>
    </p>
  )
}

function PassoRevisar({ endpoints, apiPrivada, auth, onBack, onSalvar }) {
  return (
    <Card title="Revisar" description="Revise os dados da integração antes de finalizar. Essas configurações podem ser alteradas a qualquer momento.">
      {endpoints.map((ep) => (
        <div key={ep.id} className="space-y-1.5 border-b border-hairline pb-4 last:border-0">
          <p className="text-sm font-semibold text-gray-900">Busca de vínculo — {ep.nome}</p>
          <Resumo label="Organização" value={ep.organizacao} />
          <Resumo label="URL" value={ep.url} />
          <Resumo label="Método HTTP" value={ep.metodo} />
          <Resumo label="Header Content-Type" value={ep.contentType} />
          <Resumo
            label="Headers adicionais"
            value={ep.headersAdicionais.length ? ep.headersAdicionais.map((h) => `${h.key}: ${h.value}`).join(', ') : 'Nenhum configurado'}
          />
          <div className="pt-1">
            <p className="text-sm font-semibold text-gray-900">Mapeamento (JSON Path)</p>
            <Resumo label="Centro de custo" value={ep.caminhoCentroId} />
            <Resumo label="Nome do centro de custo" value={ep.caminhoCentroNome} />
            <Resumo label="Workspace" value={ep.caminhoWorkspace} />
            <Resumo label="Iniciativa" value={ep.caminhoIniciativaId} />
            <Resumo label="Nome da iniciativa" value={ep.caminhoIniciativaNome} />
          </div>
          <div className="pt-1">
            <p className="text-sm font-semibold text-gray-900">Paginação</p>
            <Resumo label="Caminho do token" value={ep.caminhoPaginacaoToken || 'Não configurada'} />
            <Resumo label="Parâmetro da URL" value={ep.paginacaoQueryParam} />
          </div>
        </div>
      ))}

      <div>
        <p className="text-sm font-semibold text-gray-900">Busca de Autenticação</p>
        <Resumo label="Autenticação" value={apiPrivada ? 'Sim (API privada)' : 'Não (API pública)'} />
        {apiPrivada && auth && (
          <>
            <Resumo label="URL de autenticação" value={auth.url} />
            <Resumo label="Método HTTP" value={auth.metodo} />
            <Resumo label="Token (JSON Path)" value={auth.caminhoToken} />
            <Resumo label="Chave do header" value={auth.headerDestino} />
            <Resumo label="Formatação do token" value={auth.formatoToken} />
          </>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <Icon.Alert width={16} height={16} className="mt-0.5 shrink-0" />
        <p>
          <strong>Tempo de processamento do vínculo.</strong> Após salvar a configuração, a identificação e o vínculo automático dos centros de custo e iniciativas podem levar <strong>até 24 horas</strong> para serem concluídos.
        </p>
      </div>

      <StepFooter onBack={onBack} onNext={onSalvar} nextLabel="Salvar" podeAvancar />
    </Card>
  )
}
