// ViewModel para gerenciar perfis e dietas

import React, { useState, useEffect } from 'react';
import PersistenciaServico from '../../servicos/PersistenciaServico';

const CHAVE_PERFIS = 'perfis';
const CHAVE_DIETAS = 'dietasPorPerfil';

export function usePerfisViewModel() {
  // Estado para perfis
  const [perfis, setPerfis] = useState([]);

  // Estado para criação de novo perfil
  const [novoPerfil, setNovoPerfil] = useState({
    nome: '',
    peso: '',
    altura: '',
    objetivo: ''
  });

  // Estado para perfil selecionado
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);

  // Estado para modo de edição
  const [modoEdicao, setModoEdicao] = useState(false);

  // Estado para novas dietas
  const [novoNomeDieta, setNovoNomeDieta] = useState('');
  const [novosAlimentos, setNovosAlimentos] = useState('');
  const [novoHorario, setNovoHorario] = useState('');

  // Estado para dietas por perfil
  const [dietasPorPerfil, setDietasPorPerfil] = useState({});

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const perfisSalvos = await PersistenciaServico.recuperarDados(CHAVE_PERFIS);
        const dietasSalvas = await PersistenciaServico.recuperarDados(CHAVE_DIETAS);

        // Dados iniciais
        const perfisIniciais = [
          { id: '1', nome: 'João', peso: '75kg', altura: '1.75m', objetivo: 'Ganhar massa' },
          { id: '2', nome: 'Maria', peso: '60kg', altura: '1.65m', objetivo: 'Perder peso' }
        ];

        const dietasIniciais = {
          '1': [
            { id: '1', nome: 'Café da manhã', alimentos: ['Arroz', 'Feijão', 'Frango'], horario: '08:00' },
            { id: '2', nome: 'Almoço', alimentos: ['Salada', 'Peixe', 'Batata'], horario: '12:00' }
          ],
          '2': [
            { id: '3', nome: 'Jantar', alimentos: ['Macarrão', 'Carne', 'Salada'], horario: '19:00' }
          ]
        };

        // Carregar perfis
        if (perfisSalvos) {
          setPerfis(perfisSalvos);
        } else {
          setPerfis(perfisIniciais);
        }

        // Carregar dietas
        if (dietasSalvas) {
          setDietasPorPerfil(dietasSalvas);
        } else {
          setDietasPorPerfil(dietasIniciais);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        // Dados iniciais como fallback em caso de erro
        setPerfis([
          { id: '1', nome: 'João', peso: '75kg', altura: '1.75m', objetivo: 'Ganhar massa' },
          { id: '2', nome: 'Maria', peso: '60kg', altura: '1.65m', objetivo: 'Perder peso' }
        ]);
        setDietasPorPerfil({
          '1': [
            { id: '1', nome: 'Café da manhã', alimentos: ['Arroz', 'Feijão', 'Frango'], horario: '08:00' },
            { id: '2', nome: 'Almoço', alimentos: ['Salada', 'Peixe', 'Batata'], horario: '12:00' }
          ],
          '2': [
            { id: '3', nome: 'Jantar', alimentos: ['Macarrão', 'Carne', 'Salada'], horario: '19:00' }
          ]
        });
      }
    };
    carregarDados();
  }, []);

  // Função para criar novo perfil
  const handleCriarPerfil = () => {
    if (!novoPerfil.nome.trim()) return;

    const novoId = String(new Date().getTime());
    const novoPerfilCompleto = {
      id: novoId,
      ...novoPerfil
    };

    setPerfis(prev => {
      const novosPerfis = [...prev, novoPerfilCompleto];
      PersistenciaServico.salvarDados(CHAVE_PERFIS, novosPerfis);
      return novosPerfis;
    });
    setDietasPorPerfil(prev => {
      const novasDietas = {
        ...prev,
        [novoId]: []
      };
      PersistenciaServico.salvarDados(CHAVE_DIETAS, novasDietas);
      return novasDietas;
    });
    setNovoPerfil({ nome: '', peso: '', altura: '', objetivo: '' });
  };

  // Função para salvar edição do perfil
  const handleSalvarEdicao = () => {
    if (!perfilSelecionado) return;

    const perfilAtualizado = {
      ...perfilSelecionado,
      peso: perfilSelecionado.peso,
      altura: perfilSelecionado.altura,
      objetivo: perfilSelecionado.objetivo
    };

    setPerfis(prevState => {
      const perfisAtualizados = prevState.map(perfil =>
        perfil.id === perfilSelecionado.id ? perfilAtualizado : perfil
      );
      PersistenciaServico.salvarDados(CHAVE_PERFIS, perfisAtualizados);
      return perfisAtualizados;
    });
    setPerfilSelecionado(perfilAtualizado);
    setModoEdicao(false); // Desativa o modo de edição após salvar
  };

  // Funções para gerenciar perfis
  const handlePerfilClick = (perfil) => {
    setPerfilSelecionado(perfil);
  };

  const handleRemoverPerfil = (perfilId) => {
    const updatedPerfis = perfis.filter((perfil) => perfil.id !== perfilId);
    setPerfis(perfis => {
      const novosPerfis = perfis.filter((perfil) => perfil.id !== perfilId);
      PersistenciaServico.salvarDados(CHAVE_PERFIS, novosPerfis);
      return novosPerfis;
    });
    if (perfilSelecionado && perfilSelecionado.id === perfilId) {
      setPerfilSelecionado(null);
    }
  };

  const handleVoltar = () => {
    setPerfilSelecionado(null);
  };

  // Funções para gerenciar dietas
  const handleAdicionarDieta = () => {
    const novaDieta = {
      id: String(new Date().getTime()),
      nome: novoNomeDieta,
      alimentos: novosAlimentos.split(',').map((a) => a.trim()),
      horario: novoHorario,
    };

    setDietasPorPerfil(prev => {
      const novasDietas = {
        ...prev,
        [perfilSelecionado.id]: [...(prev[perfilSelecionado.id] || []), novaDieta]
      };
      PersistenciaServico.salvarDados(CHAVE_DIETAS, novasDietas);
      return novasDietas;
    });

    setNovoNomeDieta('');
    setNovosAlimentos('');
    setNovoHorario('');
  };

  const handleEditarDieta = (id, novoNome, novosAlimentos, novoHorario) => {
    setDietasPorPerfil(prevState => {
      const dietasAtualizadas = {
        ...prevState,
        [perfilSelecionado.id]: prevState[perfilSelecionado.id].map(dieta =>
          dieta.id === id ? {
            ...dieta,
            nome: novoNome,
            alimentos: novosAlimentos.split(',').map((a) => a.trim()),
            horario: novoHorario
          } : dieta
        )
      };
      PersistenciaServico.salvarDados(CHAVE_DIETAS, dietasAtualizadas);
      return dietasAtualizadas;
    });
  };

  const handleRemoverDieta = (id) => {
    setDietasPorPerfil(prevState => {
      const dietasAtualizadas = {
        ...prevState,
        [perfilSelecionado.id]: prevState[perfilSelecionado.id].filter(dieta => dieta.id !== id)
      };
      PersistenciaServico.salvarDados(CHAVE_DIETAS, dietasAtualizadas);
      return dietasAtualizadas;
    });
  };

  return {
    perfis,
    novoPerfil,
    setNovoPerfil,
    handleCriarPerfil,
    perfilSelecionado,
    setPerfilSelecionado,
    modoEdicao,
    setModoEdicao,
    novoNomeDieta,
    setNovoNomeDieta,
    novosAlimentos,
    setNovosAlimentos,
    novoHorario,
    setNovoHorario,
    dietasPorPerfil,
    handleSalvarEdicao,
    handlePerfilClick,
    handleRemoverPerfil,
    handleVoltar,
    handleAdicionarDieta,
    handleEditarDieta,
    handleRemoverDieta,
    getDietasDoPerfil: () => dietasPorPerfil[perfilSelecionado.id] || [],
  };
}
