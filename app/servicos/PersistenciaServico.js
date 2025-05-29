import AsyncStorage from '@react-native-async-storage/async-storage';

export default class PersistenciaServico {
  static async salvarDados(chave, dados) {
    try {
      const dadosJson = JSON.stringify(dados);
      await AsyncStorage.setItem(chave, dadosJson);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  static async recuperarDados(chave) {
    try {
      const dadosJson = await AsyncStorage.getItem(chave);
      return dadosJson ? JSON.parse(dadosJson) : null;
    } catch (error) {
      console.error('Erro ao recuperar dados:', error);
      return null;
    }
  }

  static async removerDados(chave) {
    try {
      await AsyncStorage.removeItem(chave);
    } catch (error) {
      console.error('Erro ao remover dados:', error);
    }
  }

  static async limparDados() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }
}
