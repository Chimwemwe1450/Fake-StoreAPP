import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const MyBottomNavigation = () => {
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'store', title: 'Store', icon: 'store' },
    { key: 'cart', title: 'Cart', icon: 'cart' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => {
      navigation.navigate('Home');
      return null;
    },
    store: () => {
      navigation.navigate('Store');
      return null;
    },
    cart: () => {
      navigation.navigate('Cart');
      return null;
    },
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyBottomNavigation;
