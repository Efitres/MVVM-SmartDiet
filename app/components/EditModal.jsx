import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Button from './Button';

export default function EditModal({ visible, onClose, onSave, children, title }) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {children}
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} />
            <Button title="Salvar" onPress={onSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
