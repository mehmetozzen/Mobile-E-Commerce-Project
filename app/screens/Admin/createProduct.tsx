import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';


const CreateProduct = () => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    thumbnail: ''
  });

  const handleInputChange = (name, value) => {
    setNewProduct(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddProduct = async () => {
    try {
      // Verileri Firestore'a ekle
      const docRef = await addDoc(collection(firestore, 'products'), newProduct);

      console.log('Product added with ID:', docRef.id);
      // Başarılı eklemenin ardından inputları temizle
      setNewProduct({
        title: '',
        description: '',
        price: '',
        brand: '',
        category: '',
        thumbnail: ''
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={newProduct.title}
        onChangeText={(text) => handleInputChange('title', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newProduct.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={newProduct.price}
        onChangeText={(text) => handleInputChange('price', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand"
        value={newProduct.brand}
        onChangeText={(text) => handleInputChange('brand', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={newProduct.category}
        onChangeText={(text) => handleInputChange('category', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Thumbnail URL"
        value={newProduct.thumbnail}
        onChangeText={(text) => handleInputChange('thumbnail', text)}
      />
      <Button title="Add Product" onPress={handleAddProduct} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default CreateProduct;
