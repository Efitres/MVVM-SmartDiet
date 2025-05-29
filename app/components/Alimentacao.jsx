// src/components/Alimentacao.jsx

import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Input from './Input';
import ActionButton from './ActionButton';
import EditModal from './EditModal';

// Componente Alimentacao para exibir e editar uma refeição
export default function Alimentacao({ dieta, onEdit, onRemove }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeDieta, setNomeDieta] = useState(dieta.nome);
  const [alimentos, setAlimentos] = useState(dieta.alimentos.join(', '));
  const [horario, setHorario] = useState(dieta.horario);

  const handleSave = () => {
    onEdit(dieta.id, nomeDieta, alimentos, horario);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.dietaItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{dieta.nome}</Text>
          <Text style={styles.alimentos}>{dieta.alimentos.join(', ')}</Text>
          <Text style={styles.horario}>Horário: {dieta.horario}</Text>
          <ActionButton icon="edit" onPress={() => setModalVisible(true)} style={styles.editButton} />
          <ActionButton icon="trash" onPress={() => {
            console.log('Removendo dieta com ID:', dieta.id);
            onRemove(dieta.id);
          }} style={styles.removeButton} />
        </View>
      </View>

      <EditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        title="Editar Dieta"
      >
        <Input
          label="Nome da dieta"
          value={nomeDieta}
          onChangeText={setNomeDieta}
          placeholder="Nome da dieta"
        />
        <Input
          label="Alimentos"
          value={alimentos}
          onChangeText={setAlimentos}
          placeholder="Alimentos"
        />
        <Input
          label="Horário"
          value={horario}
          onChangeText={setHorario}
          placeholder="Horário"
        />
      </EditModal>
    </>
  );
}

const styles = StyleSheet.create({
  dietaItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alimentos: {
    marginBottom: 8,
  },
  horario: {
    color: '#666',
  },
  editButton: {
    backgroundColor: '#007BFF',
    marginRight: 8,
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
});
