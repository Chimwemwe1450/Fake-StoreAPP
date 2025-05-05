import React from 'react';
import { View, Text, FlatList, Image, Alert, TouchableOpacity, StyleSheet } from 'react-native';

const CartScreen = ({ cartItems, onRemoveFromCart, quantities, setQuantities, setCart }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (quantities[item.id] || 1));
    }, 0);
  };

  const handleIncreaseQuantity = (item) => {
    setQuantities({ ...quantities, [item.id]: (quantities[item.id] || 1) + 1 });
  };

  const handleDecreaseQuantity = (item) => {
    if (quantities[item.id] > 1) {
      setQuantities({ ...quantities, [item.id]: quantities[item.id] - 1 });
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = 1; // Placeholder UserId
      const orderItems = cartItems.map(item => ({
        ItemName: item.title,
        Price: item.price,
        Quantity: quantities[item.id] || 1,
      }));
  
      const order = {
        UserId: userId,
        Items: orderItems,
      };
  
      const response = await fetch('http://192.168.1.64:5169/api/OrderItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
  
      if (response.ok) {
        console.log("Order submitted successfully", response);
        Alert.alert("Order Submitted", "Your order has been placed!");
  
        // ✅ Clear the cart and quantities after successful submission
        setCart([]);
        setQuantities({});
      } else {
        console.log("Order submission failed", response);
        Alert.alert("Order Failed", "There was an error submitting your order.", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      Alert.alert("Order Failed", "There was an error submitting your order.", [{ text: "OK" }]);
    }
  };
  

  const renderItem = ({ item }) => {
    const quantity = quantities[item.id] || 1;

    return (
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => handleDecreaseQuantity(item)}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => handleIncreaseQuantity(item)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveFromCart(item)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Order (${calculateTotal().toFixed(2)})</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#777',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default CartScreen;
