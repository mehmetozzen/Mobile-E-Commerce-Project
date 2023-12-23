import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, firestore } from '../../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const Sepet = () => {
  const [userCart, setUserCart] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [itemQuantities, setItemQuantities] = useState({});
  const userId = auth.currentUser.uid;

  useEffect(() => {
    fetchUserCart();
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
     
      fetchUserCart();
    }, [userId])
  );

  const fetchUserCart = async () => {
    try {
      setRefreshing(true);
  
      const q = query(collection(firestore, 'Sepet'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
  
      const userCartData = [];
      const quantities = {};
  
      querySnapshot.forEach((doc) => {
        const itemData: {
          id: string;
          title?: string; // Bu özellikler Firebase'den gelen verinin içindekilerdir, ihtiyaca göre güncelleyebilirsiniz
          price?: number;
          category?: string;
          thumbnail?: string;
          userId?: string;
          quantity?: number;
        } = { id: doc.id, ...doc.data() };
        userCartData.push(itemData);
        quantities[itemData.id] = itemData.quantity;
      });
      
  
      setUserCart(userCartData);
      setItemQuantities(quantities);
      setRefreshing(false);
    } catch (error) {
      console.error('Hata oluştu:', error);
      setRefreshing(false);
    }
  };
  

  const removeFromCart = async (itemId) => {
    try {
      await deleteDoc(doc(firestore, 'Sepet', itemId));

      const updatedCart = userCart.filter((item) => item.id !== itemId);
      setUserCart(updatedCart);

      setItemQuantities((prevQuantities) => {
        const newQuantities = { ...prevQuantities };
        delete newQuantities[itemId];
        return newQuantities;
      });
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
  };

  const updateQuantityInFirestore = async (itemId, newQuantity) => {
    try {
      const cartItemRef = doc(firestore, 'Sepet', itemId);
      await updateDoc(cartItemRef, {
        quantity: newQuantity,
      });
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
  };
  
  const updateQuantity = (itemId, newQuantity) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity,
    }));
  
    updateQuantityInFirestore(itemId, newQuantity);
  };
  
  const increaseQuantity = async (itemId) => {
    const updatedQuantity = (itemQuantities[itemId] || 0) + 1;
  
    await updateQuantityInFirestore(itemId, updatedQuantity);

    updateQuantity(itemId, updatedQuantity);
  };
  
  const decreaseQuantity = async (itemId) => {
    const updatedQuantity = Math.max((itemQuantities[itemId] || 0) - 1, 0);
  
 
    await updateQuantityInFirestore(itemId, updatedQuantity);
  
 
    updateQuantity(itemId, updatedQuantity);
  };

  const getTotalPrice = () => {
    return userCart.reduce((total, item) => total + item.price * itemQuantities[item.id], 0).toFixed(2);
  };

  const handleRefresh = () => {
    fetchUserCart();
  };

  const handleBuyButtonPress = () => {
    alert("Satın aldınız!")
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sepet</Text>
      </View>

      <FlatList
        data={userCart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image style={styles.cartItemThumbnail} source={{ uri: item.thumbnail }} />
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemTitle}>{item.title}</Text>
              <Text style={styles.cartItemPrice}>{item.price} $</Text>
            </View>
            <View style={styles.quantityButtons}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => decreaseQuantity(item.id)}>
                <MaterialIcons name="remove" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{itemQuantities[item.id]}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => increaseQuantity(item.id)}>
                <MaterialIcons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeFromCartButton}
              onPress={() => removeFromCart(item.id)}
            >
              <MaterialIcons name="highlight-remove" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Toplam Fiyat:</Text>
        <Text style={styles.totalPrice}>{getTotalPrice()} $</Text>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuyButtonPress}>
          <Text style={styles.buyButtonText}>Satın Al</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cartItemThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 16,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  quantityButton: {
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 4,
  },
  removeFromCartButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 16,
    alignItems: 'center',
    paddingBottom: 65,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buyButton: {
    backgroundColor: 'green', // Sarı renk
    borderRadius: 16, // Daha yuvarlatılmış köşeler
    paddingVertical: 20, // Daha uzun bir buton
    alignItems: 'center',
    padding:100,
    justifyContent: 'center',
    marginTop: 16, // Biraz daha aşağıda
  },
  buyButtonText: {
    color: 'black', // Siyah renk
    fontWeight: 'bold',
    fontSize: 20, // Daha büyük yazı
  },
});

export default Sepet;
