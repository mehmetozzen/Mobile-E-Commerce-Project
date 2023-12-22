import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, firestore } from '../../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const Kategoriler = ({ navigation }) => {
  const numColumns = 2;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });

      setProducts(productsData);

      // Unique kategorileri al
      const uniqueCategories = Array.from(new Set(productsData.map(product => product.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Firestore request error:', error);
    }
  };

  // Ekran odaklandığında çalışacak kodları buraya gelir
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const renderCategory = ({ item }) => {
    // products içerisinden category'si item ile eşleşen ilk ürünü bul
    const matchingProduct = products.find(product => product.category === item);

    return (
      <TouchableOpacity onPress={() => navigation.navigate('Urunler', { item, products })}>
        <View style={styles.categoriesItemContainer}>
          {matchingProduct && (
            <Image style={styles.categoriesPhoto} source={{ uri: matchingProduct.thumbnail }} />
          )}
          <Text style={styles.categoriesName}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ paddingBottom: 75 }}>
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

