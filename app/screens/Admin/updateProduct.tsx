import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';

const UpdateProduct = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    category: '',
    thumbnail: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'products'));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
        setFilteredProducts(productsData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(products);

    if (searchTerm.trim() !== '') {
      const filteredResults = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filteredResults);
    }
  }, [searchTerm, products]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setUpdatedProduct({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      brand: product.brand,
      category: product.category,
      thumbnail: product.thumbnail,
    });
    setModalVisible(true);
  };

  const handleUpdateProduct = async () => {
    try {
      setIsLoading(true); // Güncelleme işlemi başladığında loading durumunu aktifleştir
      await updateDoc(doc(firestore, 'products', selectedProduct.id), updatedProduct);
      console.log('Product updated successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsLoading(false); // Güncelleme işlemi tamamlandığında loading durumunu devre dışı bırak
    }
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectProduct(item)}>
      <View style={styles.productItem}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0782F9" />
        </View>
      ) : (
        <>
          <Text style={styles.header}>Ürünleri Güncelle</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Ürün Ara"
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProductItem}
          />

          <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Ürünü Güncelle</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={updatedProduct.title}
                  onChangeText={(text) => setUpdatedProduct((prevState) => ({ ...prevState, title: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={updatedProduct.description}
                  onChangeText={(text) => setUpdatedProduct((prevState) => ({ ...prevState, description: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  keyboardType="numeric"
                  value={updatedProduct.price}
                  onChangeText={(text) => setUpdatedProduct((prevState) => ({ ...prevState, price: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Brand"
                  value={updatedProduct.brand}
                  onChangeText={(text) => setUpdatedProduct((prevState) => ({ ...prevState, brand: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category"
                  value={updatedProduct.category}
                  onChangeText={(text) => setUpdatedProduct((prevState) => ({ ...prevState, category: text }))}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Thumbnail URL"
                  value={updatedProduct.thumbnail}
                  onChangeText={(text) => setUpdatedProduct((prevState) => ({ ...prevState, thumbnail: text }))}
                />
                <Image
                  source={{ uri: updatedProduct.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.buttonContainer}>
                  <Button title="Ürünü Güncelle" onPress={handleUpdateProduct} />
                  <Button title="İptal" onPress={toggleModal} color="red" />
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 75,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  productItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  thumbnail: {
    height: 150,
    marginTop: 8,
    borderRadius: 8,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 2,
    borderColor: '#0782F9',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default UpdateProduct;
