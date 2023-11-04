import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Entypo';
import Home from './screens/Home';
import Message from './screens/Message';
import AddCard from './screens/AddCard';
import Coin from './screens/Coin'

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
      screenOptions={{tabBarStyle:{backgroundColor:"white"}}}     
      >
        <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarLabel:"Home",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <Icon name="home" size={30} color="orange" />
          ):(
            <Icon name="home" size={30} color="#000" />
          )
        }}
        />
        <Tab.Screen 
        name="Message" 
        component={Message} 
        options={{
          tabBarLabel:"Message",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <Icon name="message" size={30} color="#000" />
          ):
          (
            <Icon name="message" size={30} color="#000" />
          )
        }}
        />
        <Tab.Screen 
        name="Coin" 
        component={Coin} 
        options={{
          tabBarLabel:"Coin",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <Icon name="coin-dollar" size={30} color="#000" />
          ):
          (
            <Icon name="coin-dollar" size={30} color="#000" />
          )
        }}
        />
        <Tab.Screen 
        name="AddCard" 
        component={AddCard} 
        options={{
          tabBarLabel:"AddCard",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <Icon name="card" size={30} color="#000" />
          ):
          (
            <Icon name="card" size={30} color="#000" />
          )
        }}
        />
       
      </Tab.Navigator>
    </NavigationContainer>
  )
}