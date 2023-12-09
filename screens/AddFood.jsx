import { View, Text, Modal, ActivityIndicator, SafeAreaView, Pressable, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import foodContext from '../components/context/foods/foodContext';
import { addfoodRoute } from '../utils/APIRoutes';

export default function AddFood() {
  const [foodname, setFoodName] = useState("")
  const [foodprice, setFoodPrice] = useState("")
  const [localFile, setLocalFile] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(undefined);
  const [foodimg, setFoodImg] = useState("")
  const [employee, setEmployee] = useState(null)
  const { setLogOutModal, logInModal, logOutModal, setLogInModal } = useContext(foodContext)
  // const [selectedImage, setSelectedImage] = useState(null);

  useFocusEffect(useCallback(() => {
    fetchIsEmployee();
  }, [logOutModal, logInModal]))
  // check employee or not
  const fetchIsEmployee = async () => {
    const localemp = await AsyncStorage.getItem("employee");
    console.log("logout", localemp)
    setEmployee(localemp);
  }
  const selectImage = () => {
    let options = {
      storageOptions: {
        path: "Image"
      }
    }
    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log("cancled");
      } else {
        console.log(res.assets[0].uri);
        setLocalFile(res.assets[0].fileName);
        setIsLoading(true);
        uploadToCloudinary(res.assets[0].uri);
      }
    })
  };
  // uploading image to cloudinary
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
          setFoodImg(`https${data.url.substring(4)}`)
          setIsLoading(false);
          console.log("dataurl", data.url);
          // setImgUploaded(true);

        }) // set image 
        .catch((error) => console.log(error))
    } else {
      console.log("No image selected")
    }
  }

  // upload new food detail to server
  const handleSubmit = () => {
    if (foodname.length > 0 && foodprice.length > 0 && foodimg.length > 0) {
      if(Number(foodprice)!==NaN&&foodprice>0){
        const url = addfoodRoute;
      let response = axios.post(url, {
        foodimg: foodimg,
        foodprice:Number(foodprice),
        foodname:foodname.toLocaleLowerCase(),
      }).then((res) => {
        if (!res.data.status) {
          setAlertMessage({msg:res.data.msg,success:false})
          hideAlert();
        } else {
          setFoodImg("");setFoodName("");setFoodPrice("");setLocalFile(undefined);
          setAlertMessage({msg:"New food added successfully!",success:true})
          hideAlert();
        }

      }).catch((err) => {
        console.log(err);
        setAlertMessage({msg:"Internal server error",success:false})
        hideAlert();
      })
      // showAllFoods();
      //  socket.current.emit("send-order",response);
      }else{
        setAlertMessage({msg:"Price should be number and not zero",success:false})
        hideAlert();
      }
    }
    else {
      setAlertMessage({msg:"All field are required",success:false})
      hideAlert();
    }
  }
// hidding alert
function hideAlert(){
  setTimeout(() => {
    setAlertMessage(undefined);
  }, 1500);
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
      {alertMessage && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: `${alertMessage.success ? "#97f7c2" : "#f78f8f"}`, padding: 10, zIndex: 5,
          flexDirection:"row",justifyContent:"space-between",borderWidth:2,borderColor:`${alertMessage.success?"green":"red"}`,
          borderRadius:7
         }}>
          <Text style={{ color: 'black',fontWeight:500 }}>{alertMessage.msg}</Text>
          <Icon name="close-circle-outline" size={24} color="black"/>
        </View>
      )}
      {/* loading modal */}
      <Modal
        // animationType="fade"
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {
          // Handle modal close
          setIsLoading(!isLoading);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: "rgba(255, 255, 255, 0.7)"
        }}>
          <ActivityIndicator size="large" color="orange" />
        </View>
      </Modal>
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
        {employee && <TouchableOpacity onPress={() => setLogOutModal(true)}>
          <Icon style={{ paddingLeft: 0 }} name="power" size={28} color="#000" />
        </TouchableOpacity>}

        {!employee && <TouchableOpacity onPress={() => setLogInModal(true)}>
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
          }} placeholder='Enter Name' value={foodname} />
          <Text style={{ marginLeft: 5, marginBottom: 5, fontSize: 17, fontWeight: 500 }}>Dish Price</Text>
          <TextInput onChangeText={(text) => setFoodPrice(text)} style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 10,
            borderRadius: 7
          }} placeholder='Enter Price' value={foodprice} />

          <Text style={{ marginLeft: 5, marginBottom: 5, fontSize: 17, fontWeight: 500 }}>Dish Image</Text>
          <TouchableOpacity onPress={selectImage} style={{ height: 40, marginBottom: 3, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "#6df2f2", borderRadius: 7 }}>
            <Text style={{ fontSize: 15, fontWeight: 500 }}>Select Image</Text>
          </TouchableOpacity>
          <Text style={{ marginLeft: 3, marginBottom: 5 }}>{localFile ? localFile : "image not selected"}</Text>

          <TouchableOpacity onPress={handleSubmit} style={{ height: 50, marginTop: 20, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "orange", borderRadius: 25 }}>
            <Text style={{ fontSize: 20, fontWeight: 500, color: "white" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
