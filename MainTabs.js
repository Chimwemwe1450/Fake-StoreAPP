import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import StoreScreen from './StoreScreen'; // ✅ Don't forget to import it

const Tab = createBottomTabNavigator();

const MainTabs = ({
  cart,
  setCart,
  cartCount,
  setCartCount,
  addToCart,
  quantities,
  setQuantities
}) => {
  const removeFromCart = (item) => {
    const updatedCart = cart.filter(cartItem => cartItem.id !== item.id);
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[item.id];

    setCart(updatedCart);
    setQuantities(updatedQuantities);
    setCartCount(updatedCart.length);
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen
            {...props}
            addToCart={addToCart}
            quantities={quantities}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Store">
        {(props) => (
          <StoreScreen
            {...props}
            addToCart={addToCart}
            quantities={quantities}
            setQuantities={setQuantities}
          />
        )}
      </Tab.Screen>
 <Tab.Screen name="Cart">
        {(props) => (
          <CartScreen
            {...props}
            cartItems={cart}
            onRemoveFromCart={removeFromCart}
            quantities={quantities}
            setQuantities={setQuantities}
            setCart={setCart}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTabs;
