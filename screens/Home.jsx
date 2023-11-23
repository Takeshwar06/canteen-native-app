import { View, TextInput, Image, Pressable, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Entypo';
import { SliderBox } from 'react-native-image-slider-box'
import HomeItem from '../components/HomeItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmployeeId, getAllFoodsRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function Home() {
  const [foods,setFoods]=useState([])
  const data = ["tiger", "tiger janghle", "tiger", "tiger", "tiger"]
  const images = [
    "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg",
    "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg",
    "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg",
  ]

  useFocusEffect(useCallback(()=>{
    setUserIdLocally();
    showAllFoods();
  },[]))
  // setUserIdLocally
  const setUserIdLocally = async()=>{
    console.log("setemp")
    await AsyncStorage.removeItem("employee")
    await AsyncStorage.removeItem("uniqueEmployeeId")
    // let a="employee"
    // let b=876546
    // await AsyncStorage.setItem("employee",JSON.stringify(a))
    // await AsyncStorage.setItem("uniqueEmployeeId",JSON.stringify(b))

    const UserId=await AsyncStorage.getItem("UserId");
    console.log(UserId+"janghle")
    if(!UserId){
      await AsyncStorage.setItem("UserId",JSON.stringify(Math.ceil(Math.random()*1000000000+(9999999999-1000000000))))
    }
  }
  // fetch all foods
  const showAllFoods=async()=>{
    console.log("showAllFoods called")
    const response= await fetch(getAllFoodsRoute,{
    // const response= await fetch('https://smartcanteen07.onrender.com/api/food/getAllFoods',{
        method:'GET',
        headers:{
          "Content-Type":"application/json",
        },
      })
      const json=await response.json();
      setFoods(json);
  }
  // add to card
  const addToCard=async(food)=>{
    showAlert(`${food.foodname} Added to Card`);
    const cardFoods=await AsyncStorage.getItem("cardFoods");
    const UserId=await AsyncStorage.getItem("UserId");

     if(!cardFoods){ // when null
      const initialCardFoods=[{
      uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
      UserId:UserId,
      EmployeeId:EmployeeId,
      foodQuantity:1,
      foodimg:food.foodimg,
      foodname:food.foodname,
      foodprice:food.foodprice,
      _id:food._id
      }]
      try {
        const result=await AsyncStorage.setItem("cardFoods",JSON.stringify(initialCardFoods));
      } catch (error) {
        console.log(error);
      }
     }else{
      const cardFoods=JSON.parse(await AsyncStorage.getItem("cardFoods"));

      const singleFood={
      uniqueOrderId:Math.ceil(Math.random()*100000000000000+(999999999999999-100000000000000)).toString(),
      UserId:UserId,
      EmployeeId:EmployeeId,
      foodQuantity:1,
      foodimg:food.foodimg,
      foodname:food.foodname,
      foodprice:food.foodprice,
      _id:food._id
      }
      cardFoods.push(singleFood);
      await AsyncStorage.setItem("cardFoods",JSON.stringify(cardFoods));
     }   
   }
  // alert methods

  const [currentAlert, setCurrentAlert] = useState(null);

  const showAlert = (message) => {
    // Update the current alert
    hideAlert();
    setCurrentAlert(message);

    // Clear the alert after a certain duration (e.g., 2000 milliseconds)
    setTimeout(() => {
      hideAlert();
    }, 2000);
  };

  const hideAlert = () => {
    // Clear the current alert
    setCurrentAlert(null);
  };

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >
      {/* alert message here */}
      {currentAlert && (
        <View style={{position: 'absolute',top: 0,left: 0,right: 0,backgroundColor: 'green',padding: 10,zIndex:5}}>
          <Text style={{color: 'white',}}>{currentAlert}</Text>
        </View>
      )}

      <ScrollView>
        <View style={{
          backgroundColor: "orange",
          padding: 10,
          flexDirection: "row",
          alignItems: 'center'
        }}>
          <Pressable style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 7,
            gap: 10,
            backgroundColor: "white",
            borderRadius: 3,
            height: 38,
            flex: 1,

          }}>
            <Icon style={{ paddingLeft: 10 }} name="home" size={22} color="#000" />
            <TextInput placeholder="Search" />
          </Pressable>
          <Icon style={{ paddingLeft: 0 }} name="home" size={22} color="#000" />
        </View>
        {/*  circule Item */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {
            foods.map((food,index) => {
              return (
                <View key={index}>
                {food.foodAvailable &&<Pressable onPress={()=>addToCard(food)}  key={index} style={{
                  margin: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }} >
                  <Image style={{
                    width: 70, height: 70,
                    borderRadius: 70 / 2,
                    resizeMode: "contain",
                  }} source={{ uri: food.foodimg.length>0?food.foodimg:"http://res.cloudinary.com/do3fiil0d/image/upload/v1700375832/foodimages/kapxhjg9k5ss1kwjnk36.jpg" }} />
                  <Text style={{
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: "500",
                    marginTop: 3,
                  }} >{food.foodname}</Text>
                </Pressable>}
                </View>
              )
            })
          }
        </ScrollView>
        <SliderBox images={images} autoPlay circleLoop />
        <Text style={{ padding: 10, fontSize: 20, fontWeight: "bold" }} >Trending Deasl of the week</Text>
        {/* card Item */}

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          {/* Home item card */}
          {
            foods.map((food,index)=>{
              return(
                <>
                {food.foodAvailable &&<HomeItem key={index} addToCard={addToCard} food={food}/>}
                </>
              )
            })
          }
         
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}