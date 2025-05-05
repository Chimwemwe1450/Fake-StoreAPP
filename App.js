// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RegistrationScreen from './RegistrationScreen';
import MainTabs from './MainTabs'; // Import the Bottom Tab wrapper

const Stack = createNativeStackNavigator();

export default function App() {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState({});

 const addToCart = (item) => {
    const itemExists = cart.find((cartItem) => cartItem.id === item.id);
    if (itemExists) {
      setQuantities({...quantities, [item.id]: quantities[item.id] + 1})
      return;
    } else {
      setCart([...cart, item]);
      setCartCount(cartCount + 1);
      setQuantities({...quantities, [item.id]: 1});
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {props => <RegistrationScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
          {props => (
            <MainTabs
              {...props}
              cart={cart}
              setCart={setCart}
              cartCount={cartCount}
              setCartCount={setCartCount}
              addToCart={addToCart}
              quantities={quantities}
              setQuantities={setQuantities}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
