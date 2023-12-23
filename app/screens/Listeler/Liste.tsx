import React from 'react';
import { View, Text, Button,StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Liste = ({ navigation }) => {
  

  const navigateToIstekListesi = () => {
    navigation.navigate("Istek");  // 'istek' sayfa adı doğru olmalı
  };

  const navigateToFavoriUrunListesi = () => {
    navigation.navigate('Fav');  // 'fav' sayfa adı doğru olmalı
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      

      <TouchableOpacity onPress={navigateToIstekListesi} style={styles.button}>
        <Text style={styles.buttonText}>İstek Listesi</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToFavoriUrunListesi} style={styles.button}>
        <Text style={styles.buttonText}>Favori Ürün Listesi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Liste;
