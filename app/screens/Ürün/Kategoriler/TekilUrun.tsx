import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, firestore } from '../../../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
const TekilUrun = ({ route }) => {
  const { product } = route.params;
  const navigation = useNavigation();
  const [isWishlistSelected, setWishlistSelected] = useState(false);
  const [isFavorilistSelected, setFavorilistSelected] = useState(false);

  const addToCart = async () => {
    try {
      const userId = auth.currentUser.uid;

      
      const cartQuery = query(collection(firestore, 'Sepet'), where('userId', '==', userId), where('title', '==', product.title));
      const cartQuerySnapshot = await getDocs(cartQuery);

      if (cartQuerySnapshot.empty) {
    
        const cartItem = {
          title: product.title,
          price: product.price,
          category: product.category,
          thumbnail: product.thumbnail,
          userId: userId,
          quantity: 1, 
        };

        const cartCollection = collection(firestore, 'Sepet');
        const docRef = await addDoc(cartCollection, cartItem);

        console.log('Ürün sepete eklendi:', docRef.id);
      } else {
        
        const cartItem = cartQuerySnapshot.docs[0].data();
        const cartItemId = cartQuerySnapshot.docs[0].id;

        await updateDoc(doc(firestore, 'Sepet', cartItemId), {
          quantity: cartItem.quantity + 1,
        });

        console.log('Ürün miktarı artırıldı:', cartItemId);
      }
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: product.title, 
    });
    const checkWishlist = async () => {
      try {
        const userId = auth.currentUser.uid;
        const wishlistQuery = query(collection(firestore, 'Wishlist'), where('userId', '==', userId), where('title', '==', product.title));
        const wishlistQuerySnapshot = await getDocs(wishlistQuery);
        setWishlistSelected(!wishlistQuerySnapshot.empty);
      } catch (error) {
        console.error('İstek listesi kontrol hatası:', error);
      }
    };

    const checkFavorilist = async () => {
      try {
        const userId = auth.currentUser.uid;
        const favorilistQuery = query(collection(firestore, 'Favorilist'), where('userId', '==', userId), where('title', '==', product.title));
        const favorilistQuerySnapshot = await getDocs(favorilistQuery);
        setFavorilistSelected(!favorilistQuerySnapshot.empty);
      } catch (error) {
        console.error('Favori listesi kontrol hatası:', error);
      }
    };


    checkWishlist();
    checkFavorilist();
  }, [product.title]);
  const addToWishlist = async () => {
    try {
      const userId = auth.currentUser.uid;

      
      const wishlistQuery = query(collection(firestore, 'Wishlist'), where('userId', '==', userId), where('title', '==', product.title));
      const wishlistQuerySnapshot = await getDocs(wishlistQuery);

      if (wishlistQuerySnapshot.empty) {
       
        const wishlistItem = {
          title: product.title,
          price: product.price,
          category: product.category,
          thumbnail: product.thumbnail,
          userId: userId,
        };

        const wishlistCollection = collection(firestore, 'Wishlist');
        const docRef = await addDoc(wishlistCollection, wishlistItem);

        console.log('Ürün istek listesine eklendi:', docRef.id);
      } else {
        
        const wishlistItemId = wishlistQuerySnapshot.docs[0].id;
        await deleteDoc(doc(firestore, 'Wishlist', wishlistItemId));

        console.log('Ürün istek listesinden çıkarıldı:', wishlistItemId);
      }
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
    setWishlistSelected(!isWishlistSelected);
  };

  const addToFavorilist = async () => {
    try {
      const userId = auth.currentUser.uid;

      // Kullanıcının favori listesindeki ürünleri kontrol et
      const favorilistQuery = query(collection(firestore, 'Favorilist'), where('userId', '==', userId), where('title', '==', product.title));
      const favorilistQuerySnapshot = await getDocs(favorilistQuery);

      if (favorilistQuerySnapshot.empty) {
        // Favori listesinde yoksa, ekleyin

        const favorilistItem = {
          title: product.title,
          price: product.price,
          category: product.category,
          thumbnail: product.thumbnail,
          userId: userId,
        };

        const favorilistCollection = collection(firestore, 'Favorilist');
        const docRef = await addDoc(favorilistCollection, favorilistItem);

        console.log('Ürün favori listesine eklendi:', docRef.id);
      } else {
        // Favori listesinde varsa, silelim

        const favorilistItemId = favorilistQuerySnapshot.docs[0].id;
        await deleteDoc(doc(firestore, 'Favorilist', favorilistItemId));

        console.log('Ürün favori listesinden çıkarıldı:', favorilistItemId);

      }
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
    setFavorilistSelected(!isFavorilistSelected);
  };
  

  return (
    <View style={styles.container}>
      <Image style={styles.productPhoto} source={{ uri: product.thumbnail }} />

      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>

      <TouchableOpacity style={styles.addToWishlistButton} onPress={addToFavorilist}>
        <Ionicons name="ios-star" size={32} color={isFavorilistSelected ? 'yellow' : 'grey'} />
      </TouchableOpacity>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
          <Text style={styles.buttonText}>Sepete Ekle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.addTolistButton,
            { backgroundColor: isWishlistSelected ? 'red' : 'green' }
          ]}
          onPress={addToWishlist}
        >
          <Text style={styles.buttonText}>
            {isWishlistSelected ? 'İstek Listesinden Çıkar' : 'İstek Listesine Ekle'}
          </Text>
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
