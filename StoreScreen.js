import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  buttonWrapper: {
    margin: 5,
    width: '45%',
  },
  productItem: {
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
  },
});

function StoreScreen({ addToCart, quantities, setQuantities }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [sort, setSort] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => {
        setProducts(json);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });

    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(json => setCategories(json))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    } else if (sort === 'name') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sortContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Categories" onPress={() => setIsCategoryModalVisible(true)} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Sort by Price" onPress={() => setSort('price')} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Sort by Name" onPress={() => setSort('name')} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title={sortOrder === 'asc' ? 'Descending' : 'Ascending'}
            onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          />
        </View>
      </View>

      <FlatList
        data={sortedProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
          </View>
        )}
      />

      <Modal
        visible={isCategoryModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <FlatList
            data={[{ name: 'All', id: 'all' }, ...categories.map(cat => ({ name: cat, id: cat }))]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => {
                  setSelectedCategory(item.id === 'all' ? null : item.name);
                  setIsCategoryModalVisible(false);
                }}
              >
                <Text style={styles.categoryText}>{item.name.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

export default StoreScreen;
