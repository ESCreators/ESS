import React, { useContext, useEffect } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile, MenuList } from '../screens';
import { MaterialIcons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const TabIcon = ({ name, focused }) => {
  const theme = useContext(ThemeContext);
  return (
    <MaterialIcons
      name={name}
      size={26}
      color={focused ? theme.tabBtnActive : theme.tabBtnInactive}
    />
  );
};

const Tab = createBottomTabNavigator();

const Home = ({ navigation, route }) => {
  useEffect(() => {
    const screenName = getFocusedRouteNameFromRoute(route) || '장비선택';
    navigation.setOptions({
      headerTitle: screenName,
    });
  });
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='장비선택'
        component={MenuList}
        options={{
          tabBarIcon: ({ focused }) =>
            TabIcon({
              name: focused ? 'engineering' : 'engineering',
              focused,
            }),
        }}
      />
      <Tab.Screen
        name='프로필'
        component={Profile} 
        options={{
          tabBarIcon: ({ focused }) =>
            TabIcon({
              name: focused ? 'person' : 'person-outline',
              focused,
            }),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
