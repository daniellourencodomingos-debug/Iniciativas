import { createContext, useContext, useMemo, useReducer } from 'react'
import {
  CENTROS_INICIAIS,
  INICIATIVAS_INICIAIS,
  VINCULOS_INICIAIS,
  GERENTES,
  somaOrcamentos,
} from '../data/mock.js'

const AppContext = createContext(null)

let seq = 0
const uid = (p = 'id') => `${p}-${Date.now().toString(36)}${(seq++).toString(36)}`

const initialState = {
  centros: CENTROS_INICIAIS,
  iniciativas: INICIATIVAS_INICIAIS,
  vinculos: VINCULOS_INICIAIS,
  gerentes: GERENTES,
}

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE_CENTRO':
      return { ...state, centros: [...state.centros, action.payload] }

    case 'UPDATE_CENTRO':
      return {
        ...state,
        centros: state.centros.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c,
        ),
      }

    case 'DELETE_CENTRO': {
      const vinculos = state.vinculos.filter((v) => v.centroId !== action.id)
      const comVinculo = new Set(vinculos.map((v) => v.iniciativaId))
      return {
        ...state,
        centros: state.centros.filter((c) => c.id !== action.id),
        vinculos,
        iniciativas: state.iniciativas.filter((i) => comVinculo.has(i.id)),
      }
    }

    case 'CREATE_INICIATIVA':
      return { ...state, iniciativas: [...state.iniciativas, action.payload] }

    case 'UPDATE_INICIATIVA':
      return {
        ...state,
        iniciativas: state.iniciativas.map((i) =>
          i.id === action.payload.id ? { ...i, ...action.payload } : i,
        ),
      }

    case 'DELETE_INICIATIVA':
      return {
        ...state,
        iniciativas: state.iniciativas.filter((i) => i.id !== action.id),
        vinculos: state.vinculos.filter((v) => v.iniciativaId !== action.id),
      }

    case 'CREATE_VINCULO':
      return { ...state, vinculos: [...state.vinculos, action.payload] }

    case 'UPDATE_VINCULO':
      return {
        ...state,
        vinculos: state.vinculos.map((v) =>
          v.id === action.payload.id ? { ...v, ...action.payload } : v,
        ),
      }

    case 'DELETE_VINCULO':
      return { ...state, vinculos: state.vinculos.filter((v) => v.id !== action.id) }

    // Substitui todos os vínculos de uma iniciativa pela lista informada.
    case 'SYNC_INICIATIVA_VINCULOS': {
      const outros = state.vinculos.filter(
        (v) => v.iniciativaId !== action.iniciativaId,
      )
      return { ...state, vinculos: [...outros, ...action.vinculos] }
    }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const helpers = useMemo(() => {
    const vinculosDoCentro = (centroId) =>
      state.vinculos.filter((v) => v.centroId === centroId)
    const vinculosDaIniciativa = (iniciativaId) =>
      state.vinculos.filter((v) => v.iniciativaId === iniciativaId)

    return {
      vinculosDoCentro,
      vinculosDaIniciativa,
      centroTotal: (centroId) =>
        vinculosDoCentro(centroId).reduce(
          (s, v) => s + somaOrcamentos(v.orcamentos),
          0,
        ),
      iniciativaTotal: (iniciativaId) =>
        vinculosDaIniciativa(iniciativaId).reduce(
          (s, v) => s + somaOrcamentos(v.orcamentos),
          0,
        ),
      centrosDaIniciativa: (iniciativaId) => [
        ...new Set(vinculosDaIniciativa(iniciativaId).map((v) => v.centroId)),
      ],
      iniciativasDoCentro: (centroId) => [
        ...new Set(vinculosDoCentro(centroId).map((v) => v.iniciativaId)),
      ],
      centroById: (id) => state.centros.find((c) => c.id === id),
      iniciativaById: (id) => state.iniciativas.find((i) => i.id === id),
      iniciativaBySlug: (slug) =>
        state.iniciativas.find((i) => i.slug === slug),
      gerenteById: (id) => state.gerentes.find((g) => g.id === id),
    }
  }, [state])

  return (
    <AppContext.Provider value={{ ...state, dispatch, uid, ...helpers }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
