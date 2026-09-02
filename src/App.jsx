import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import CentrosDeCusto from './pages/CentrosDeCusto.jsx'
import CentroDeCustoForm from './pages/CentroDeCustoForm.jsx'
import Iniciativas from './pages/Iniciativas.jsx'
import IniciativaForm from './pages/IniciativaForm.jsx'
import Placeholder from './pages/Placeholder.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/centros-de-custo" replace />} />

        <Route path="/centros-de-custo" element={<CentrosDeCusto />} />
        <Route path="/centros-de-custo/novo" element={<CentroDeCustoForm />} />
        <Route path="/centros-de-custo/:id/editar" element={<CentroDeCustoForm />} />

        <Route path="/iniciativas" element={<Iniciativas />} />
        <Route path="/iniciativas/nova" element={<IniciativaForm />} />
        <Route path="/iniciativas/:id/editar" element={<IniciativaForm />} />

        <Route path="/central-de-aprovacoes" element={<Placeholder title="Central de Aprovações" />} />

        <Route path="/orcamento" element={<Placeholder title="Orçamento, consumo e ofensores" />} />
        <Route path="/historico-previsoes" element={<Placeholder title="Histórico de Previsões" />} />
        <Route path="/recomendacoes" element={<Placeholder title="Recomendações" />} />
        <Route path="/estrutura-financeira" element={<Placeholder title="Estrutura financeira" />} />
        <Route path="/relatorios" element={<Placeholder title="Relatórios" />} />
        <Route path="/iam" element={<Placeholder title="IAM — Gestão de usuários" />} />
        <Route path="/integrar-cloud" element={<Placeholder title="Integrar serviço de cloud" />} />
        <Route path="/documentacao" element={<Placeholder title="Documentação" />} />

        <Route path="*" element={<Navigate to="/centros-de-custo" replace />} />
      </Route>
    </Routes>
  )
}
