import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import Home from './screens/Home';
import Message from './screens/Message';
import AddCard from './screens/AddCard';
import Coin from './screens/Coin'
import Scanner from './screens/Scanner';
import UpdateFood from './screens/UpdateFood';

const Tab = createBottomTabNavigator();
export default function App() {
  console.log("tiger jintjtjtjtjda hai")
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
            <IoIcon name="logo-instagram" size={30} color="orange" />
          ):(
            <IoIcon name="home" size={30} color="#000" />
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
            <IoIcon name="qr-code" size={30} color="#000" />
          ):
          (
            <IoIcon name="message" size={30} color="#000" />
          )
        }}
        />
        <Tab.Screen 
        name="Update" 
        component={UpdateFood} 
        options={{
          tabBarLabel:"Update",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <IoIcon name="shuffle" size={30} color="#000" />
          ):
          (
            <IoIcon name="shuffle" size={30} color="#000" />
          )
        }}
        />
        <Tab.Screen 
        name="Scanner" 
        component={Scanner} 
        options={{
          tabBarLabel:"Scanner",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <Icon name="qrcode-scan" size={27} color="#000" />
          ):
          (
            <Icon name="qrcode-scan" size={27} color="#000" />
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
            <IoIcon name="cart" size={30} color="#000" />
          ):
          (
            <IoIcon name="cart" size={30} color="#000" />
          )
        }}
        />
       
      </Tab.Navigator>
    </NavigationContainer>
  )
}