import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useState,useContext, useEffect } from 'react'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Message from './Message';
import AddCard from './AddCard';
import Coin from './Coin'
import Scanner from './Scanner';
import UpdateFood from './UpdateFood';
import AddFood from './AddFood';
import foodContext from '../components/context/foods/foodContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Tab = createBottomTabNavigator();
export default function WrapApp() {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [employee,setEmployee]=useState(null);
   const {logInModal,logOutModal,setLogOutModal,setLogInModal}=useContext(foodContext);
   
   const fetchempid=async()=>{
    const localemp=await AsyncStorage.getItem("employee");
    setEmployee(localemp);
  }
  useEffect(()=>{
     fetchempid();
  },[logOutModal,logInModal])
    // log out functionality
    const logOut=async()=>{
      await AsyncStorage.removeItem("employee");
      setLogOutModal(false)
     }
     // log in functionality
     const logIn=async(email,password)=>{
          if(email==='tiger@gmail.com'&&password==='t tiger'){
            await AsyncStorage.setItem("employee","employee");
             setEmail(""); 
             setPassword("");
             setLogInModal(false);
          }else{
            alert("pleace login with right creadincial")
          }
     }
  return (<>
 
      {/*LOG-In modal section */}
     {logInModal&&<View style={{
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

    }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={logInModal}
        onRequestClose={() => {
          // Handle modal close
          setLogInModal(!logInModal);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: "rgba(255, 255, 255, 0.7)"
        }}>
          <View style={{
            margin: 20,
            backgroundColor: 'white',
            width: "95%",
            borderWidth: 1.5,
            borderColor: "orange",
            borderRadius: 20,
            padding: 15,
            alignItems: 'center',
          }}>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'flex-end', marginBottom: 5 }} >
              <TouchableOpacity onPress={() => setLogInModal(false)}>
                <IoIcon name="close-circle-outline" size={30} ></IoIcon>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 30 }}>Login with your Employee id</Text>

            <View style={{ width: "100%", paddingHorizontal: 7, display: "flex", justifyContent: "flex-start" }}>
              <Text style={{
                marginLeft: 5,
                marginBottom: 7,
                fontSize: 17,
                fontWeight: 500
              }}
              >Email</Text>
              <TextInput style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                marginBottom: 10,
                paddingLeft: 10,
                borderRadius: 7
              }} placeholder='Enter Email' value={email} onChangeText={(text)=>setEmail(text)} />
              <Text style={{
                marginLeft: 5,
                marginBottom: 7,
                fontSize: 17,
                fontWeight: 500
              }}
              >Password</Text>
              <TextInput style={{
                height: 40,
                borderColor: 'gray',
                borderWidth: 1,
                marginBottom: 25,
                paddingLeft: 10,
                borderRadius: 7
              }} placeholder='Enter Password' onChangeText={(text)=>setPassword(text)} secureTextEntry={true} value={password} />
            </View>

            <View style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}>
              <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 100,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={() => logIn(email,password)}>
                <Text style={{ fontSize: 17, fontWeight: 500, color: "white" }}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>} 

    {/*LOG-OUT modal section */}
    {logOutModal&& <View style={{
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

    }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={logOutModal}
        onRequestClose={() => {
          // Handle modal close
          setModalVisible(!logOutModal);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: "rgba(255, 255, 255, 0.7)"
        }}>
          <View style={{
            margin: 20,
            backgroundColor: 'white',
            width: "95%",
            borderWidth: 1.5,
            borderColor: "orange",
            borderRadius: 20,
            padding: 15,
            alignItems: 'center',
          }}>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'flex-end', marginBottom: 30 }} >
              <TouchableOpacity onPress={() => setLogOutModal(false)}>
                <IoIcon name="close-circle-outline" size={30} ></IoIcon>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 30 }}>Do You Want To Logout</Text>

            <View style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 25,
            }}>
              <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={() => setLogOutModal(false)}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={() => logOut()}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>} 

    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ tabBarStyle: { backgroundColor: "white" } }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: "Home",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <IoIcon name="home" size={30} color="orange" />
                ) : (
                <IoIcon name="home-outline" size={30} color="#000" />
              )
          }}
        />
        <Tab.Screen
          name="Message"
          component={ Message}
          options={{
            tabBarLabel: "Message",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <IoIcon name="chatbox-ellipses" size={30} color="orange" />
              ) :
                (
                  <IoIcon name="chatbox-ellipses-outline" size={30} color="#000" />
                )
          }}
        />
        {employee&&<Tab.Screen
          name="Scanner"
          component={ Scanner}
          options={{
            tabBarLabel: "Scanner",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Icon name="qrcode-scan" size={27} color="orange" />
              ) :
                (
                  <Icon name="qrcode-scan" size={27} color="#000" />
                )
          }}
        />}
        {employee&&<Tab.Screen
          name="Update"
          component={UpdateFood }
          options={{
            tabBarLabel: "Update",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <IoIcon name="shuffle" size={30} color="orange" />
              ) :
                (
                  <IoIcon name="shuffle" size={30} color="#000" />
                )
          }}
        />}
       {employee&& <Tab.Screen
          name="AddFood"
          component={AddFood}
          options={{
            tabBarLabel: "AddFood",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <IoIcon name="server" size={30} color="orange" />
              ) :
                (
                  <IoIcon name="server-outline" size={30} color="#000" />
                )
          }}
        />}
        {!employee&& <Tab.Screen 
        name="AddCard" 
        component={AddCard} 
        options={{
          tabBarLabel:"AddCard",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <IoIcon name="cart" size={30} color="orange" />
          ):
          (
            <IoIcon name="cart-outline" size={30} color="#000" />
          )
        }}
        /> }

        {!employee&& <Tab.Screen 
        name="Coin" 
        component={Coin} 
        options={{
          tabBarLabel:"Coin",
          headerShown:false,
          tabBarLabelStyle:{color:"#008E97"},
          tabBarIcon:({focused})=>
          focused ? (
            <IoIcon name="aperture" size={30} color="orange" />
          ):
          (
            <IoIcon name="aperture-outline" size={30} color="#000" />
          )
        }}
        /> }

      </Tab.Navigator>
    </NavigationContainer>
  
  </>
  )
}