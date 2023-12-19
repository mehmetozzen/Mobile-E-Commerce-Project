import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView, TouchableHighlight, Dimensions, TouchableOpacity, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../../../firebaseConfig';

const Kategoriler = ({ navigation }) => {

  const numColumns = 2; // urunlerin ikili sıralanması (categoriesItemContainer den de degistirmeyi unutma)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  //kategori resimlerini aynı alıyorsun onu api yazınca değiştiririz.
  //Urun verilerini çekiyoruz
  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);

        // Unique kategorileri al
        const uniqueCategories = Array.from(new Set(data.products.map(product => product.category)));
        setCategories(uniqueCategories);

      })
      .catch(error => console.error('API request error:', error));
  }, []);

  const renderCategory = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Urunler', { item, products })}>
      <View style={styles.categoriesItemContainer}>
        <Image style={styles.categoriesPhoto} source={{ uri: "https://i.dummyjson.com/data/products/1/thumbnail.jpg" }} />
        <Text style={styles.categoriesName}>{item}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={{ paddingBottom: 125 }}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        numColumns={numColumns}
      />
    </SafeAreaView>

  );
};

export default Kategoriler;





const styles = StyleSheet.create({
  categoriesItemContainer: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 215,
    borderColor: '#cccccc',
    borderWidth: 0.5,
    borderRadius: 20,
    width: Dimensions.get('window').width / 2 - 20, // İki sütunlu düzen için genişliği ayarlıyoruz
  },
  categoriesPhoto: {
    width: '100%',
    height: 155,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  categoriesName: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    marginTop: 8
  },
  categoriesInfo: {
    marginTop: 3,
    marginBottom: 5
  }
});

