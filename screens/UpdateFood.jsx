import { View, SafeAreaView, Text, Pressable, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import IoIcon from "react-native-vector-icons/Ionicons"
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { getAllFoodsRoute, updateAvailableRoute } from '../utils/APIRoutes';
import axios from 'axios';

export default function UpdateFood() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFood, setSearchFood] = useState([])
  const [foods, setFoods] = useState([])
  // to use showAllFoods();

  useFocusEffect(useCallback(() => {
    // if (localStorage.getItem("employee")) {
    //   navigate("/updatefood");
    // } else { navigate("/") }
    showAllFoods();
  }, []))

  const foodAvailable = async (id, available) => {
    // console.log("foodavbl",id,available);
    let response = await axios.post(`${updateAvailableRoute}/${id}`, { 
      foodAvailable: available
    })
    
    // navigate("/updatefood")
  }

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    if (text !== "") {
      const newFoodItem = foods.filter((element) => {
        return element.foodname.toLowerCase().includes(text.toLowerCase());
      })
      console.log(newFoodItem)
      setSearchFood(newFoodItem);
    }
    else {
      setSearchFood(foods);
    }
  }
  // fetching all foods
  const showAllFoods = async () => {
    console.log("showAllFoods called")
    const response = await fetch(getAllFoodsRoute, {
      // const response= await fetch('https://smartcanteen07.onrender.com/api/food/getAllFoods',{
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    const json = await response.json();
    setFoods(json);
  }
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >
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
          <IoIcon style={{ paddingLeft: 10 }} name="search" size={27} color="#000" />
          <TextInput onChangeText={(text) => handleSearchChange(text)} placeholder="Search" />
        </Pressable>
        <IoIcon style={{ paddingLeft: 0 }} name="exit" size={28} color="#000" />
      </View>
      <Text style={{
        fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
      }}>Update food available</Text>

      <ScrollView>
        {
          searchTerm.length < 1 && foods.map((food,index) => {
            return (
              <View key={index} style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
                <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius: 5 }} source={{ uri:food.foodimg.length>0?food.foodimg: "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                <View style={{ height: 130, width: "60%", paddingHorizontal: 15 }}>
                  <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Name : {food.foodname}</Text>
                      <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 5 }}>Price : ₹{food.foodprice}</Text>
                    </View>
                    <View style={{ marginRight:5 }}>
                      {food.foodAvailable&&<IoIcon name="checkmark-circle" color={"green"} size={30}></IoIcon>}
                     {!food.foodAvailable&&<IoIcon name="close-circle" color={"red"} size={30}></IoIcon>}
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}>

                    {food.foodAvailable && <TouchableOpacity onPress={() => { foodAvailable(food._id, false) }} style={{ marginLeft: 35, height: 40, width: 120, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 20 }} >
                      <Text style={{ fontWeight: 500 }}>NotAvailable</Text>
                    </TouchableOpacity>}

                    {!food.foodAvailable && <TouchableOpacity onPress={() => { foodAvailable(food._id, true) }} style={{ marginLeft: 35, height: 40, width: 120, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 20 }} >
                      <Text style={{ fontWeight: 500 }}>Available</Text>
                    </TouchableOpacity>}

                  </View>
                </View>
              </View>
            )
          })
        }
        {/* search foods */}

        {
          searchTerm.length > 0 && searchFood.map((food,index) => {
            return (
              <View key={index} style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
                <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius: 5 }} source={{ uri:food.foodimg.length>0?food.foodimg: "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                <View style={{ height: 130, width: "60%", paddingHorizontal: 15 }}>
                  <View style={{ flexDirection: "row",justifyContent:"space-between" }}>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Name : {food.foodname}</Text>
                      <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 5 }}>Price : ₹{food.foodprice}</Text>
                    </View>
                    <View style={{ marginRight:5 }}>
                      {food.foodAvailable&&<IoIcon name="checkmark-circle" color={"green"} size={30}></IoIcon>}
                     {!food.foodAvailable&&<IoIcon name="close-circle" color={"red"} size={30}></IoIcon>}
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }}>

                    {food.foodAvailable && <TouchableOpacity onPress={() => { foodAvailable(food._id, false) }} style={{ marginLeft: 35, height: 40, width: 120, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 20 }} >
                      <Text style={{ fontWeight: 500 }}>NotAvailable</Text>
                    </TouchableOpacity>}

                    {!food.foodAvailable && <TouchableOpacity onPress={() => { foodAvailable(food._id, true) }} style={{ marginLeft: 35, height: 40, width: 120, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 20 }} >
                      <Text style={{ fontWeight: 500 }}>Available</Text>
                    </TouchableOpacity>}

                  </View>
                </View>
              </View>
            )
          })
        }
      </ScrollView>
    </SafeAreaView>
  )
}