import { View, Text, SafeAreaView, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import React, { useCallback,useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import foodContext from '../components/context/foods/foodContext';

export default function AddFood() {
  const [foodname, setFoodName] = useState("")
  const [foodprice, setFoodPrice] = useState("")
  const [foodimg, setFoodImg] = useState("")
  const [count,setCount]=useState(0);
  const [employee, setEmployee] = useState(null)
  const {setLogOutModal,logInModal,logOutModal,setLogInModal}=useContext(foodContext)
  // const [selectedImage, setSelectedImage] = useState(null);

  // useEffect(()=>{
  //   console.log("logout")
  //   setCount(count+1)
  // },[logOutModal])
  useFocusEffect(useCallback(() => {
    fetchIsEmployee();
  }, [logOutModal,logInModal]))
  // check employee or not
  const fetchIsEmployee = async () => {
    const localemp = await AsyncStorage.getItem("employee");
    console.log("logout",localemp)
    setEmployee(localemp);
  }
  const selectImage = () => {
    ImagePicker.showImagePicker({}, (response) => {
      if (!response.didCancel && !response.error) {
        // setSelectedImage(response.uri);
        uploadToCloudinary(response.uri)
      }
    });
  };

  const uploadToCloudinary = async (selectedImage) => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        type: 'image/jpeg', // or the type of your image
        name: 'image.jpg',
      });
      formData.append("upload_preset", "foodimage");
      formData.append("cloud_name", "do3fiil0d")
      fetch("https://api.cloudinary.com/v1_1/do3fiil0d/image/upload", {
        method: "post",
        body: formData
      }).then((res) => res.json())
        .then((data) => {
          setFoodImg(data.url)
          // setImgUploaded(true);

        }) // set image 
        .catch((error) => console.log(error))
    } else {
      console.log("No image selected")
    }
  }
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >
      {/* alert message here */}
      {/* {currentAlert && (
      <View style={{position: 'absolute',top: 0,left: 0,right: 0,backgroundColor: 'green',padding: 10,zIndex:5}}>
        <Text style={{color: 'white',}}>{currentAlert}</Text>
      </View>
    )} */}
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
          <Icon style={{ paddingLeft: 10 }} name="search" size={22} color="#000" />
          <TextInput placeholder="Search" />
        </Pressable>
        {employee && <TouchableOpacity onPress={()=>setLogOutModal(true)}>
          <Icon style={{ paddingLeft: 0 }} name="power" size={28} color="#000" />
        </TouchableOpacity>}

        {!employee && <TouchableOpacity onPress={()=>setLogInModal(true)}>
          <Icon style={{ paddingLeft: 0 }} name="person-circle-outline" size={30} color="#000" />
        </TouchableOpacity>}
      </View>
      <Text style={{
        fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
      }}>Add New Food</Text>
      <ScrollView>
        <View style={{ padding: 20, }}>
          <Text style={{
            marginLeft: 5,
            marginBottom: 5,
            fontSize: 17,
            fontWeight: 500
          }}
          >Dish Name</Text>
          <TextInput onChangeText={(text) => setFoodName(text)} style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 10,
            borderRadius: 7
          }} placeholder='Enter Name' />
          <Text style={{ marginLeft: 5, marginBottom: 5, fontSize: 17, fontWeight: 500 }}>Dish Price {count}</Text>
          <TextInput onChangeText={(text) => setFoodPrice(text)} style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 10,
            borderRadius: 7
          }} placeholder='Enter Price' />

          <Text style={{ marginLeft: 5, marginBottom: 5, fontSize: 17, fontWeight: 500 }}>Dish Image</Text>
          <TouchableOpacity onPress={selectImage} style={{ height: 40, marginBottom: 10, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "#6df2f2", borderRadius: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: 500 }}>Select Image</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ height: 50, marginTop: 20, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "orange", borderRadius: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: 500, color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
