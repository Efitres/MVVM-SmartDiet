import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, FlatList, TextInput, Button, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { usePerfisViewModel } from '../viewmodels/perfis/PerfisViewModel';
import Alimentacao from '../components/Alimentacao'; // Importe o componente

export default function TelaPerfis() {
  const vm = usePerfisViewModel();
  const [modoEdicao, setModoEdicao] = useState(false);

  // Inicializar novoPerfil se não existir
  useEffect(() => {
    if (!vm.novoPerfil) {
      vm.setNovoPerfil({ nome: '', peso: '', altura: '', objetivo: '' });
    }
  }, []);

  // Função para salvar as alterações
  const handleSalvar = () => {
    if (!vm.perfilSelecionado) return;
    
    const perfilAtualizado = {
      ...vm.perfilSelecionado,
      peso: vm.perfilSelecionado.peso,
      altura: vm.perfilSelecionado.altura,
      objetivo: vm.perfilSelecionado.objetivo
    };

    vm.handleSalvarEdicao();
    setModoEdicao(false);
  };

  // Atualizar o perfil selecionado quando o modo de edição mudar
  useEffect(() => {
    console.log('Modo de edição:', modoEdicao);
    if (!vm.perfilSelecionado) return;
    vm.setPerfilSelecionado({ ...vm.perfilSelecionado });
  }, [modoEdicao]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.botaoVoltarLogin} onPress={() => router.push('/')}>
        <Text style={styles.botaoVoltarLoginTexto}>Voltar para Login</Text>
      </TouchableOpacity>

      {/* Seção para criar novo perfil */}
      {vm.perfilSelecionado ? (
        <View style={styles.perfisContainer}>
          <Text style={styles.title}>Perfil: {vm.perfilSelecionado.nome}</Text>

          {modoEdicao ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Peso"
                value={vm.perfilSelecionado.peso}
                onChangeText={(texto) => vm.setPerfilSelecionado({ ...vm.perfilSelecionado, peso: texto })}
              />
              <TextInput
                style={styles.input}
                placeholder="Altura"
                value={vm.perfilSelecionado.altura}
                onChangeText={(texto) => vm.setPerfilSelecionado({ ...vm.perfilSelecionado, altura: texto })}
              />
              <TextInput
                style={styles.input}
                placeholder="Objetivo"
                value={vm.perfilSelecionado.objetivo}
                onChangeText={(texto) => vm.setPerfilSelecionado({ ...vm.perfilSelecionado, objetivo: texto })}
              />
              <Button title="Salvar" onPress={handleSalvar} />
              <Button title="Cancelar" onPress={() => setModoEdicao(false)} />
            </>
          ) : (
            <>
              <Text>Peso: {vm.perfilSelecionado.peso}</Text>
              <Text>Altura: {vm.perfilSelecionado.altura}</Text>
              <Text>Objetivo: {vm.perfilSelecionado.objetivo}</Text>
              <Button title="Editar Métricas" onPress={() => setModoEdicao(true)} />
            </>
          )}

          <FlatList
            data={vm.getDietasDoPerfil()}
            renderItem={({ item }) => (
              <Alimentacao
                dieta={item}
                onEdit={vm.handleEditarDieta}
                onRemove={(id) => vm.handleRemoverDieta(id)}
              />
            )}
            keyExtractor={(item) => item.id}
            extraData={vm.dietasPorPerfil}
          />

          <TextInput
            style={styles.input}
            placeholder="Nome da nova alimentação"
            value={vm.novoNomeDieta}
            onChangeText={vm.setNovoNomeDieta}
          />
          <TextInput
            style={styles.input}
            placeholder="Alimentos"
            value={vm.novosAlimentos}
            onChangeText={vm.setNovosAlimentos}
          />
          <TextInput
            style={styles.input}
            placeholder="Horário"
            value={vm.novoHorario}
            onChangeText={vm.setNovoHorario}
          />
          <Button title="Adicionar Alimentação" onPress={vm.handleAdicionarDieta} />
          <View style={{ marginBottom: 20 }} />
          <Button title="Voltar para a lista de perfis" onPress={vm.handleVoltar} />
          <View style={{ marginBottom: 12 }} />
        </View>
      ) : (
        <View style={styles.perfisContainer}>
          <Text style={styles.title}>Meus Perfis</Text>
          <FlatList
            data={vm.perfis}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text onPress={() => vm.handlePerfilClick(item)}>{item.nome}</Text>
                <TouchableOpacity onPress={() => vm.handleRemoverPerfil(item.id)} style={styles.removerPerfilButton}>
                  <Text style={styles.removerPerfilText}>X</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.novoPerfilContainer}>
            <Text style={styles.novoPerfilTitulo}>Criar Novo Perfil</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={vm.novoPerfil?.nome || ''}
              onChangeText={(texto) => vm.setNovoPerfil({...vm.novoPerfil, nome: texto})}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso"
              value={vm.novoPerfil?.peso || ''}
              onChangeText={(texto) => vm.setNovoPerfil({...vm.novoPerfil, peso: texto})}
            />
            <TextInput
              style={styles.input}
              placeholder="Altura"
              value={vm.novoPerfil?.altura || ''}
              onChangeText={(texto) => vm.setNovoPerfil({...vm.novoPerfil, altura: texto})}
            />
            <TextInput
              style={styles.input}
              placeholder="Objetivo"
              value={vm.novoPerfil?.objetivo || ''}
              onChangeText={(texto) => vm.setNovoPerfil({...vm.novoPerfil, objetivo: texto})}
            />
            <Button title="Criar Perfil" onPress={vm.handleCriarPerfil} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  novoPerfilContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  novoPerfilTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  perfilItem: {
    flexDirection: 'row',
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  botaoVoltarLogin: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoVoltarLoginTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  perfisContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#e0f7fa',
    marginBottom: 8,
    borderRadius: 8,
  },
  removerPerfilButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
  },
  removerPerfilText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});
