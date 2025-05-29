// src/viewmodels/usePerfisViewModel.js

import React, { useState, useEffect } from 'react';

export function usePerfisViewModel() {
  // Inicializando perfis com dados de exemplo
  const [perfis, setPerfis] = useState([
    { id: '1', nome: 'João', peso: '75kg', altura: '1.75m', objetivo: 'Ganhar massa' },
    { id: '2', nome: 'Maria', peso: '60kg', altura: '1.65m', objetivo: 'Perder peso' },
  ]);

  // Estado para o perfil selecionado
  const [perfilSelecionado, setPerfilSelecionado] = useState(null);
  const [dietasPorPerfil, setDietasPorPerfil] = useState({
    '1': [
      { id: '1', nome: 'Café da manhã', alimentos: ['Arroz', 'Feijão', 'Frango'], horario: '08:00' },
      { id: '2', nome: 'Almoço', alimentos: ['Salada', 'Peixe', 'Batata'], horario: '12:00' },
    ],
    '2': [
      { id: '3', nome: 'Jantar', alimentos: ['Macarrão', 'Carne', 'Salada'], horario: '19:00' },
    ],
  });
  const [novoNomeDieta, setNovoNomeDieta] = useState('');
  const [novosAlimentos, setNovosAlimentos] = useState('');
  const [novoHorario, setNovoHorario] = useState('');

  // Função para editar dieta
  const handleEditarDieta = (id, novoNome, novosAlimentos, novoHorario) => {
    const perfilAtualizado = { ...perfilSelecionado };
    const dietaAtualizada = perfilAtualizado.dietas.map(dieta =>
      dieta.id === id ? { ...dieta, nome: novoNome, alimentos: novosAlimentos.split(','), horario: novoHorario } : dieta
    );
    setPerfilSelecionado(perfilAtualizado);
  };

  // Função para remover dieta
  const handleRemoverDieta = (perfilId, dietaId) => {
    const perfilAtualizado = { ...perfilSelecionado };
    perfilAtualizado.dietas = perfilAtualizado.dietas.filter(dieta => dieta.id !== dietaId);
    setPerfilSelecionado(perfilAtualizado);
  };

  // Função para selecionar um perfil
  const handlePerfilClick = (perfil) => {
    setPerfilSelecionado(perfil);
  };

  // Função para remover um perfil
  const handleRemoverPerfil = (perfilId) => {
    const updatedPerfis = perfis.filter((perfil) => perfil.id !== perfilId);
    setPerfis(updatedPerfis);
    if (perfilSelecionado && perfilSelecionado.id === perfilId) {
      setPerfilSelecionado(null);
    }
  };

  // Função para voltar para a lista de perfis
  const handleVoltar = () => {
    setPerfilSelecionado(null);
  };

  // Função para adicionar uma nova dieta
  const handleAdicionarDieta = () => {
    const novaDieta = {
      id: String(new Date().getTime()),
      nome: novoNomeDieta,
      alimentos: novosAlimentos.split(',').map((a) => a.trim()),
      horario: novoHorario,
    };

    setDietasPorPerfil((prevState) => ({
      ...prevState,
      [perfilSelecionado.id]: [...(prevState[perfilSelecionado.id] || []), novaDieta],
    }));

    setNovoNomeDieta('');
    setNovosAlimentos('');
    setNovoHorario('');
  };

  return {
    perfis,
    perfilSelecionado,
    dietasPorPerfil,
    novoNomeDieta,
    setNovoNomeDieta,
    novosAlimentos,
    setNovosAlimentos,
    novoHorario,
    setNovoHorario,
    handlePerfilClick,
    handleRemoverPerfil,
    handleVoltar,
    handleAdicionarDieta,
    handleEditarDieta,
    handleRemoverDieta,
  };
}
