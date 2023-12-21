import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const TekilUrun = ({ route }) => {
  const { product } = route.params;
  const [isWishlistSelected, setWishlistSelected] = useState(false);

  const addToCart = () => {
    // Sepete ekleme 
    console.log('Sepete eklendi:', product.title);
  };

  const addToWishlist = () => { // sitek listesi ve favori listesini ayır ikiside buna bağlı
    // İstek listesi
    console.log('İstek listesine eklendi:', product.title);
    setWishlistSelected(!isWishlistSelected); //  buna göre çıkartıp eklersin artık dikkat!1!!
  };

  return (
    <View style={styles.container}>
      <Image style={styles.productPhoto} source={{ uri: product.thumbnail }} />

      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>

      <TouchableOpacity style={styles.addToWishlistButton} onPress={addToWishlist}>
        <Ionicons name="ios-star" size={32} color={isWishlistSelected ? 'yellow' : 'grey'} />
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.buttonText}>Sepete Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addTolistButton} onPress={addToWishlist}>
          <Text style={styles.buttonText}>Listeye Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TekilUrun;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  productPhoto: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  productInfo: {
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
  },
  addToWishlistButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starButton: {
    width: 20,
    height: 20,
    backgroundColor: 'yellow',
    borderRadius: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addToCartButton: {
    flex: 3,
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  addTolistButton: {
    flex: 1,
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
