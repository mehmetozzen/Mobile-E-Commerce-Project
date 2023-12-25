import React, { useEffect, useState } from 'react';
import { Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';

const UrunSayfasi = ({ route }) => {
  const { item, products } = route.params;
  const [categoryProducts, setCategoryProducts] = useState([]);
  const navigation = useNavigation(); // useNavigation hook'u ile navigation prop'unu al

  useEffect(() => {
    // Ürün Filtreleme
    const filteredProducts = products.filter(product => product.category === item);
    setCategoryProducts(filteredProducts);
  }, [item, products]);

  const goToProductDetail = (selectedProduct) => {
    // TekilUrun sayfasına git
    navigation.dispatch(
      StackActions.push('Tekil Urun', { product: selectedProduct })
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.productItemContainer} onPress={() => goToProductDetail(item)}>
      <Image style={styles.productPhoto} source={{ uri: item.thumbnail }} />
      <Text style={styles.productName}>{item.title}</Text>
      <Text style={styles.productPrice}>{item.price} $</Text>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={{ paddingBottom: 85 }}>
      <FlatList
        data={categoryProducts}
        renderItem={renderItem}
        keyExtractor={(product) => product.id.toString()}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

export default UrunSayfasi;

const styles = StyleSheet.create({
  productItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 215,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
    width: Dimensions.get('window').width / 2 - 20,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'grey', 
  },
  productPhoto: {
    width: '100%',
    height: 155,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  productName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8,
  },
});
