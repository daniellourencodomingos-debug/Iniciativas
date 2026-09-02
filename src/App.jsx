import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Iniciativas from './pages/Iniciativas.jsx'
import IniciativaForm from './pages/IniciativaForm.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/iniciativas" replace />} />

        <Route path="/iniciativas" element={<Iniciativas />} />
        <Route path="/iniciativas/nova" element={<IniciativaForm />} />
        <Route path="/iniciativas/:id/editar" element={<IniciativaForm />} />

        {/* Centro de custo continua no menu, mas sem tela funcional. */}
        <Route
          path="/centros-de-custo"
          element={<Placeholder title="Centros de custo" />}
        />

        <Route path="/central-de-aprovacoes" element={<Placeholder title="Central de Aprovações" />} />

        <Route path="/orcamento" element={<Placeholder title="Orçamento, consumo e ofensores" />} />
        <Route path="/historico-previsoes" element={<Placeholder title="Histórico de Previsões" />} />
        <Route path="/recomendacoes" element={<Placeholder title="Recomendações" />} />
        <Route path="/estrutura-financeira" element={<Placeholder title="Estrutura financeira" />} />
        <Route path="/relatorios" element={<Placeholder title="Relatórios" />} />
        <Route path="/iam" element={<Placeholder title="IAM — Gestão de usuários" />} />
        <Route path="/integrar-cloud" element={<Placeholder title="Integrar serviço de cloud" />} />
        <Route path="/documentacao" element={<Placeholder title="Documentação" />} />

        <Route path="*" element={<Navigate to="/iniciativas" replace />} />
      </Route>
    </Routes>
  )
}
