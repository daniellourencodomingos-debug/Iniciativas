# Protótipo FinOps — Centro de Custo + Iniciativas + Vínculos

Protótipo web (React + Vite + Tailwind CSS). Dados mock, tudo em memória.

## Modelo

- **Centro de Custo** — identidade (nome, código, gerente). **Sem orçamento próprio.**
- **Iniciativa** — identidade (nome/slug).
- **Vínculo** — `Iniciativa + Centro de Custo + (Cloud → Orçamento)` +
  `alerta` (`nenhum` | `padrao` = 75/85/90%) + e-mails. Todo orçamento/alerta vive aqui.
- "Orçamento total" de CC e de Iniciativa é **derivado** (soma dos Vínculos).

> "Workspaces" está fora de escopo — só botão mock, sem lógica.

## Rodar

```bash
npm install
npm run dev
```

## Rotas

| Rota | Descrição |
| --- | --- |
| `/centros-de-custo` | Listagem (busca, total, ordenação, orçamento total derivado) |
| `/centros-de-custo/novo` · `/:id/editar` | Form; edição inclui "Orçamento total" + "Vínculos com Iniciativas" |
| `/iniciativas` | Listagem global (centros como chips, orçamento total derivado) |
| `/iniciativas/nova` · `/:id/editar` | **Wizard de 4 etapas** com o Stepper da plataforma |
| `/central-de-aprovacoes` | Placeholder (link do toast de confirmação) |

## Stepper e formulários

`src/components/Stepper.jsx` — barra segmentada em formato de seta/chevron
encaixadas (igual a "Solicitação de Workspace"): etapa atual com fundo azul
`#3468A4` e texto branco; concluídas com ✓ + rótulo cinza sobre fundo cinza
claro; futuras em cinza. Rola horizontalmente quando estreito.

`src/components/fields.jsx` — `Field` (contorno + rótulo flutuante sobre a linha,
estilo Material outlined) + `TextInput` / `Select` / `TextArea` / `SearchInput`.
Usados em todos os formulários. `EmailChipsInput` traz o ícone de busca e vive
dentro de um `Field`.

`AttentionBanner` tem `variant`: `atencao` (âmbar, padrão) e `importante`
(azul claro + ícone de info, usado no wizard).

Etapas do wizard de Iniciativa: **Instruções → Dados da Iniciativa → Vínculo com
Centro de Custo → Responsáveis** (e-mails, mínimo 2 → "Enviar solicitação" →
toast "Solicitação enviada! Os aprovadores serão notificados." + link
"Acompanhar na Central de Aprovações").

## Componentes reutilizáveis

`FormCard`, `Field` + `TextInput`/`Select`/`TextArea`/`SearchInput`,
`AttentionBanner`, `Stepper`, `Toast`, `EmailChipsInput`, `ExpandableSection`,
`SidebarItem`, `OrcamentoCloudRows`, `VinculoEditor`, `DeleteModal`.

Estado global: `src/store/AppContext.jsx` (`useReducer` + seletores derivados).
Dados mock: `src/data/mock.js`.
