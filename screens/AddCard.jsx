import { View, Text,Modal, Image, TextInput, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CardItem from '../components/CardItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { getCoin,updateCoin, getkey, ordergenerate, paymentVarificationForApp } from '../utils/APIRoutes';
import axios from 'axios';
import IoIcon from 'react-native-vector-icons/Ionicons'

export default function AddCard() {
  const [foods, setFoods] = useState([]);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // fetching card foods from AsyncStorage
  const fetchCardFoods = async () => {
    let cardFoods = await AsyncStorage.getItem("cardFoods");
    console.log("card", cardFoods)
    if (cardFoods) {
      cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
      setFoods(cardFoods);
    } else {
      setFoods([])
    }
  }
  useFocusEffect(useCallback(() => {
    console.log("tigerfoucuEfefect")
    fetchCardFoods();
  }, [])
  );

  // count Sub Total Price
  useEffect(() => {
    let totalPrice = 0;
    foods.forEach((food) => {
      totalPrice = totalPrice + (food.foodQuantity * food.foodprice)
    })
    setTotal(totalPrice);
  }, [foods])

  // open modal to select payment using coin or another payment method
  const selectPaymentModal = async () => {
    let a = 9098754023;
    await AsyncStorage.setItem("referenceNum", JSON.stringify(a));
    // navigation.navigate("Message");
    setModalVisible(true)
    // paymentProcess(50);
  }

  // coin process code
  const coinPorcess = async (total)=>{
      console.log("coin process started")
      const UserId=await AsyncStorage.getItem("UserId");
      const data=await axios.post(getCoin,{userId:UserId})
      console.log(data);
      if(data.data.length>0&&data.data[0].coin>=total){
        console.log("same")
           const coinUpdated=await axios.post(updateCoin,{
            userId:UserId,
            updatedCoin:(data.data[0].coin)-(total)
           })
           console.log(coinUpdated);
           if(coinUpdated.data.acknowledged===true){
            console.log("acknowl")
            const referenceNum=`coin%${Math.ceil(Math.random()*100000+(999999-100000))}`
            await AsyncStorage.setItem("referenceNum",referenceNum);
            setModalVisible(false)
            navigation.navigate("Message");
           }else{alert("order failed try again")}
      } else{
        alert("you have not coin to buy this food")
      }
  }
  // payment process code
  const paymentProcess = async (total) => {

    try {
      const { data: { key } } = await axios.get(getkey);
      const { data: { order } } = await axios.post(ordergenerate, {
        amount: total
      }) //first generate order 


      // varification
      const options = {
        key: key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Smart-Canteen",
        description: "Test Transaction",
        image: 'https://res.cloudinary.com/do3fiil0d/image/upload/v1700605328/foodimages/rlqhj8e2nuly90la2bcz.jpg',
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9691382464"
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "black"
        }
      };
      RazorpayCheckout.open(options).then(async(data) => {
        // handle success
        const response=await axios.post(paymentVarificationForApp,{
          razorpay_payment_id:data.razorpay_payment_id,
          razorpay_order_id:data.razorpay_order_id,
          razorpay_signature:data.razorpay_signature,
        })
        console.log(response);
        setModalVisible(false)
        navigation.navigate("Message");
        alert(`Success: ${data.razorpay_payment_id}`);
      }).catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  // toggle modal
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  return (
  <>
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >
      <View style={styles.container}>
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
            <IoIcon style={{ paddingLeft: 10 }} name="home" size={22} color="#000" />
            <TextInput placeholder="Search" />
          </Pressable>
          <IoIcon style={{ paddingLeft: 0 }} name="home" size={22} color="#000" />
        </View>
        <Text style={{
          fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
        }}>Please Order your Food</Text>

        {/* Card Item */}
        <ScrollView style={{ marginBottom: 100 }}>
          {
            foods.map((food, index) => {
              return (
                <CardItem key={index} food={food} />
              )
            })
          }
        </ScrollView>
        <View style={styles.bottomBar}>
          <View style={{ borderBottomColor: "black", borderBottomWidth: 1, justifyContent: "space-between", flexDirection: "row", width: "100%" }}>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>Items</Text>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>{foods.length}</Text>
          </View>
          <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", }}>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>SubTotal</Text>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>₹{total}</Text>
          </View>
          <TouchableOpacity disabled={total>0?false:true} onPress={()=>total>0&&setModalVisible(true)} style={{ marginTop: 5, height: 40, backgroundColor:"orange",opacity: total>0?null:0.5, width: "100%", borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>

    {/* modal section */}
    <View style={{
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Handle modal close
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:"rgba(255, 255, 255, 0.7)"
        }}>
          <View style={{
            margin: 20,
            backgroundColor: 'white',
            width: "95%",
            borderWidth:1.5,
            borderColor:"orange",
            borderRadius: 20,
            padding: 15,
            alignItems: 'center',
          }}>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'flex-end', marginBottom: 30 }} >
              <TouchableOpacity onPress={()=>setModalVisible(false)}>
                <IoIcon name="close-circle-outline" size={30} ></IoIcon>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 30 }}>Please select an option to make payment</Text>

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
              }} onPress={()=>coinPorcess(total)}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Coin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={()=>paymentProcess(total)}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Rupees</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
});