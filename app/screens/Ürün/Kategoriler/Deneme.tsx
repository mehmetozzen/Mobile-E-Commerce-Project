import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // API'den veri çekme işlemi
    fetch('https://dummyjson.com/products')
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error('API request error:', error));
  }, []);

  const renderProductItem = ({ item }) => (
    <View style={{ marginBottom: 20 }}>
      <Image
        source={{ uri: item.thumbnail }}
        style={{ width: 100, height: 100, resizeMode: 'cover' }}
      />
      <Text>{item.title}</Text>
      <Text>{item.category}</Text>
    </View>
  );

  return (

    <View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
      />
    </View>

  );
};

export default ProductList;
