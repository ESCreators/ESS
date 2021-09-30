import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CheckList, MenuList } from '../screens';
import Home from './Home';

const Stack = createStackNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);
  console.log('');
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: '#2a3c55', },
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='MenuList' component={MenuList} />
      <Stack.Screen name='CheckList' component={CheckList} options={({ route }) => ({ title: route.params.name })} />
    </Stack.Navigator>
  );
};

export default Main;
