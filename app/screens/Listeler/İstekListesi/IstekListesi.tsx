import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where, onSnapshot, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../../firebaseConfig';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';

const IstekListesi = () => {
  const navigation = useNavigation();
  const [istekListesi, setIstekListesi] = useState([]);

  useEffect(() => {
    const fetchIstekListesi = async () => {
      try {
        const userId = auth.currentUser.uid;
        const q = query(collection(firestore, 'Wishlist'), where('userId', '==', userId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const istekListesiData = [];
          querySnapshot.forEach((doc) => {
            istekListesiData.push({ id: doc.id, ...doc.data() });
          });
          setIstekListesi(istekListesiData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('İstek listesi getirme hatası:', error);
      }
    };

    fetchIstekListesi();
  }, []);

  const renderIstekUrun = ({ item }) => {
    const handleDelete = async () => {
      try {
        await deleteDoc(doc(firestore, 'Wishlist', item.id));
        console.log('Ürün istek listesinden silindi:', item.id);
      } catch (error) {
        console.error('Ürünü istek listesinden silme hatası:', error);
      }
    };

    const handleAddToCart = async () => {
      try {
        const userId = auth.currentUser.uid;
  
        // Eklenecek ürün sepette var mı diye kontrol et
        const cartQuery = query(collection(firestore, 'Sepet'), where('userId', '==', userId), where('title', '==', item.title));
        const cartQuerySnapshot = await getDocs(cartQuery);
  
        if (cartQuerySnapshot.empty) {
          // Sepette yoksa yeni ürünü ekleyin
          const cartItem = {
            title: item.title,
            price: item.price,
            category: item.category,
            thumbnail: item.thumbnail,
            userId: userId,
            quantity: 1, // Yeni eklenen ürünün miktarı 1
          };
  
          const cartCollection = collection(firestore, 'Sepet');
          const docRef = await addDoc(cartCollection, cartItem);
  
          console.log('Ürün sepete eklendi:', docRef.id);
        } else {
          // Sepette varsa miktarını artırın
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

    return (
      <TouchableOpacity style={styles.istekUrunItem}>
        <Image style={styles.istekUrunResim} source={{ uri: item.thumbnail }} />
        <View style={styles.istekUrunBilgi}>
          <Text>{item.title}</Text>
          <Text>{item.price}</Text>
        </View>
        <View style={styles.butonContainer}>
          <TouchableOpacity style={[styles.buton, { backgroundColor: 'green' }]} onPress={handleAddToCart}>
            <FontAwesome5 name="shopping-basket" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buton, { backgroundColor: 'red' }]} onPress={handleDelete}>
            <AntDesign name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>İstek Listeniz!</Text>
      </View>
      <FlatList
        data={istekListesi}
        renderItem={renderIstekUrun}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  istekUrunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 16,
  },
  istekUrunResim: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 16,
  },
  istekUrunBilgi: {
    flex: 1,
  },
  butonContainer: {
    flexDirection: 'row',
  },
  buton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IstekListesi;
