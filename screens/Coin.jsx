import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState,useCallback, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, TextInput, } from 'react-native';
import { getCoin } from '../utils/APIRoutes';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Coin = () => {
  const navigation=useNavigation();
  const [error,setError]=useState(undefined);
  const [userId,setUserId]=useState(undefined)
  const [currentId,setCurrentId]=useState(null);
  const [id,setId]=useState(null);

  useFocusEffect(useCallback(()=>{
      setError(undefined);
      featchCoin();
  },[]))

  const featchCoin=async()=>{
    const UserId=await AsyncStorage.getItem("UserId");
    setCurrentId(UserId);
    const data=await axios.post(getCoin,{userId:UserId})
    if(data.data.length>0){
     setUserId(data.data[0].coin);
    }
 }

 const handleSend=async()=>{
  if(id.length>0){
    const data=await axios.post(getCoin,{userId:id}) 
    if(data.data.length>0){
      setUserId(undefined);
      await AsyncStorage.setItem("UserId",id);
      setId("")
      featchCoin();
    } 
    else{
      setError("user Id not found");
      setTimeout(() => {
        errorOfFunction();
      }, 2000);
    } 
  }
}
function errorOfFunction(){
  setError(undefined);
}
  return (
    <ScrollView>
      {/* alert message here */}
      {error && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'red', padding: 10, zIndex: 5 }}>
          <Text style={{ color: 'white', }}>{error}</Text>
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
          <View style={{ backgroundColor: "#79f7e7", borderRadius: 150 }}>
            <Image style={{ width: "100%", height: "100%", }} source={require('../images/coin.png')} />
          </View>
        </View>
        <Text style={{
          fontSize: 30, fontWeight: "bold",
        }}>Wallet ₹<Text style={{ color: "orange" }}>{!userId?0:userId}</Text></Text>
        <Text style={{
          fontSize: 22, fontWeight: "bold",
        }}>User-Id : <Text style={{ color: "orange" }}>{currentId}</Text></Text>

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
          }} placeholder='id should be 10 digit' value={id} onChangeText={(text)=>setId(text)} />
          <TouchableOpacity onPress={handleSend} style={{ height: 50, marginTop: 10, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "orange", borderRadius: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: 500, color: "white" }}>Login</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: 500, textAlign: 'center', marginTop: 10 }}>if you have coin then remeber your id to use login</Text>
        </View>
          <TouchableOpacity style={{ marginVertical:15, }} onPress={()=>navigation.navigate("Home")}>
            <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 500, color: "orange" }}>Order Now</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Coin;
