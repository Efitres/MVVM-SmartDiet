import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ActionButton({ icon, onPress, style }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <FontAwesome name={icon} size={20} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
});
