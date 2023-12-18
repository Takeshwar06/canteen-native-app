import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, TextInput, Button, ActivityIndicator, } from 'react-native';
import { createCoin, getCoin } from '../utils/APIRoutes';
import Icon from 'react-native-vector-icons/Ionicons'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const Coin = () => {
  const navigation = useNavigation();
  const [error, setError] = useState(undefined);
  const [userId, setUserId] = useState(undefined)
  const [currentId, setCurrentId] = useState(null);
  const [newUserLogin, setNewUserLogin] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [user,setUser]=useState(null);
  const [authLoaing,setAuthLoading]=useState(false);
  const [id, setId] = useState(null);


  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '322426661854-975sdlqm60jrp8pl8t7goe536oriagob.apps.googleusercontent.com',
    });
  }, [])

  useFocusEffect(useCallback(() => {
    console.log(auth().currentUser)
    setError(undefined);
    featchCoin();
  }, []))

  const featchCoin = async () => {
    const UserId = await AsyncStorage.getItem("UserId");
    setCurrentId(UserId);
    const data = await axios.post(getCoin, { userId: UserId })
    if (data.data.length > 0) {
      setUserId(data.data[0].coin);
    }
  }

  const handleSend = async () => {
    if (id.length > 0) {
      const data = await axios.post(getCoin, { userId: id })
      if (data.data.length > 0) {
        setUserId(undefined);
        await AsyncStorage.setItem("UserId", id);
        setId("")
        featchCoin();
      }
      else {
        setError("user Id not found");
        setTimeout(() => {
          errorOfFunction();
        }, 2000);
      }
    }
  }
  function errorOfFunction() {
    setError(undefined);
  }
  useEffect(() => {
    setUser(auth().currentUser);
    console.log("before auth().crent check")
    if (userEmail) {
      console.log("after auth().crent check")
      userAuthentication();
    }
  }, [newUserLogin])

  // user authentication
  const userAuthentication = async () => {
    setAuthLoading(true);
    console.log("userAuth")
    const response = await axios.post(createCoin, {
      userName,
      userEmail,
      userImage,
    })
    setUserEmail(null);setUserName(null);setUserImage(null);
    if(response.data.userId){
      await AsyncStorage.setItem("UserId",response.data.userId);
      featchCoin();
      setAuthLoading(false);
    }
  }
  const login = async () => {
    // Check if your device supports Google Play
    console.log("googgogogogo,tiger");
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken, user } = await GoogleSignin.signIn();
    setAuthLoading(true)
    console.log("user", user);
    setUserEmail(user.email); setUserName(user.name); setUserImage(user.photo);
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    setNewUserLogin(!newUserLogin);
    await auth().signInWithCredential(googleCredential);
    setUser(auth().currentUser);
    setAuthLoading(false);
  };

  async function signOut() {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      console.log('User signed out successfully');
      await AsyncStorage.removeItem("UserId");
      setUser(null);
      featchCoin();
      // You can perform additional actions after sign out if needed
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  }
  return (
    <ScrollView>
      {/* alert message here */}
      {error && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#f78f8f', padding: 10, zIndex: 5,
          flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "red",
          borderRadius: 7
        }}>
          <Text style={{ color: 'black', fontWeight: 500 }}>{error}</Text>
          <Icon name="close-circle-outline" size={24} color="black" />
        </View>
      )}
      <View style={{ display: "flex", alignItems: "center", height: "100%" }} >
        {/* <StatusBar backgroundColor={"#000"} /> */}
        <View style={{
          width: 600, height: 600, backgroundColor: "orange",
          borderRadius: 270,
          position: "absolute", top: -450,
        }}>
        </View>
        <View style={{
          height: 200, width: 200, backgroundColor: "red",
          borderRadius: 150, marginTop: 30, backgroundColor: "white",
          overflow: "hidden", padding: 10
        }}>
            <Image style={{ width: "100%", height: "100%",borderRadius:200 }} source={{uri:user?user.photoURL:"https://res.cloudinary.com/do3fiil0d/image/upload/v1702630521/canteen-user_mcfnzg.jpg"}} />

        </View>
        <Text style={{
          fontSize: 30, fontWeight: "bold",
        }}>Wallet ₹<Text style={{ color: "orange" }}>{!userId ? 0 : userId}</Text></Text>
        <Text style={{
          fontSize: 22, fontWeight: "bold",
        }}>Name : <Text style={{ color: "orange" }}>{user?user.displayName:"canteen-user"}</Text></Text>

        <View style={{ width: "100%", paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{
            marginLeft: 5,
            marginBottom: 7,
            fontSize: 17,
            fontWeight: 500
          }}
          >User-id</Text>
          <TextInput style={{
            height: 50,
            fontSize: 16,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 10,
            borderRadius: 7
          }} placeholder='id should be 10 digit' value={id} onChangeText={(text) => setId(text)} />
         { !user?<TouchableOpacity onPress={login} style={{ height: 50, marginTop: 10, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "orange", borderRadius: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: 500, color: "white" }}>{authLoaing?<ActivityIndicator size={'small'}/>:<>Login with google</>}</Text>
          </TouchableOpacity>
          :<TouchableOpacity onPress={signOut} style={{ height: 50, marginTop: 10, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "orange", borderRadius: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: 500, color: "white" }}>{authLoaing?<ActivityIndicator size={'small'}/>:"Logout"}</Text>
          </TouchableOpacity>}
          <Text style={{ fontSize: 17,marginHorizontal:10,fontWeight: 500, textAlign: 'center', marginTop: 10 }}>if you have coin then remeber your email id to use login</Text>
        </View>
        <TouchableOpacity style={{ marginVertical: 15, }} onPress={() => navigation.navigate("Home")}>
          <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "orange" }}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Coin;
