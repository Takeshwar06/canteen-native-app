import { View, Text, Modal, Image, TextInput,ActivityIndicator, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { getCoin, updateCoin, addorder, getkey, ordergenerate, paymentVarificationForApp } from '../utils/APIRoutes';
import axios from 'axios';
import IoIcon from 'react-native-vector-icons/Ionicons'
import foodContext from '../components/context/foods/foodContext';

export default function AddCard() {
  const [foods, setFoods] = useState([]);
  const [total, setTotal] = useState(0);
  const [employee, setEmployee] = useState(null)
  const [successModal, setSuccessModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { setLogOutModal, setLogInModal } = useContext(foodContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // fetching card foods from AsyncStorage
  const fetchCardFoods = async () => {
    const localemp = await AsyncStorage.getItem("employee")
    setEmployee(localemp);
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
    setIsLoading(true);
    setSuccessModal(false);
    setModalVisible(false);
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
  const coinPorcess = async (total) => {
    console.log("coin process started")
    setModalVisible(false);
    setSuccessModal(true);
    const UserId = await AsyncStorage.getItem("UserId");
    const data = await axios.post(getCoin, { userId: UserId })
    console.log(data);
    if (data.data.length > 0 && data.data[0].coin >= total) {
      console.log("same")
      const coinUpdated = await axios.post(updateCoin, {
        userId: UserId,
        updatedCoin: (data.data[0].coin) - (total)
      })
      console.log(coinUpdated);
      if (coinUpdated.data.acknowledged === true) {
        console.log("acknowl")
        const referenceNum = `coin%${Math.ceil(Math.random() * 100000 + (999999 - 100000))}`
        await AsyncStorage.setItem("referenceNum", referenceNum);
        const cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
        addOrder(cardFoods, referenceNum);
        // setModalVisible(false)
        // navigation.navigate("Message");
      } else {setSuccessModal(false); alert("order failed try again");}
    } else {
      setSuccessModal(false);
      alert("you have not coin to buy this food")
    }
  }
  // payment process code
  const paymentProcess = async (total) => {
      setModalVisible(false);
      setSuccessModal(true);
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
        image: 'https://res.cloudinary.com/do3fiil0d/image/upload/v1701536784/smartCanteenLogo_tbtynk.jpg',
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        prefill: {
          name: "Takeshwar",
          email: "Takeshwar124@gmail.com",
          contact: "9691382464"
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "orange"
        }
      };
      RazorpayCheckout.open(options).then(async (data) => {
        // handle success
        const response = await axios.post(paymentVarificationForApp, {
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_signature: data.razorpay_signature,
        })
        console.log(response);
        await AsyncStorage.setItem("referenceNum", JSON.stringify(data.razorpay_order_id));
        const cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
        addOrder(cardFoods, data.razorpay_order_id);
        // setModalVisible(false)
        // navigation.navigate("Message");
        // alert(`Success: ${data.razorpay_payment_id}`);
      }).catch((error) => {
        // handle failure
        setSuccessModal(false);
        alert(`Error: ${error.code} | ${error.description}`);
      });
    }
    catch (err) {
      console.log(err);
    }
  }

  // addOrder to data-base
  const addOrder = async (cardFoods, order_id) => {
    console.log("addorder called")
    cardFoods.forEach(async (food) => {
      const response = await axios.post(addorder, {
        uniqueOrderId: food.uniqueOrderId,
        foodname: food.foodname,
        UserId: food.UserId,
        EmployeeId: food.EmployeeId,
        foodQuantity: food.foodQuantity,
        foodprice: food.foodprice,
        foodimg: food.foodimg,
        placed: false,
        order_id: order_id
      })
    });
    setIsLoading(false);
    setTimeout(() => {
      setIsLoading(true);
      navigation.navigate("Message");
    }, 800);
  }

  // food quantity ++
  const foodQuantityPlus = async (index) => {
    const cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
    cardFoods[index].foodQuantity++;
    setFoods(cardFoods);
    await AsyncStorage.setItem("cardFoods", JSON.stringify(cardFoods))
  }
  // food quantity --
  const foodQuantityMinus = async (index) => {
    const cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
     if(cardFoods[index].foodQuantity>1){
      cardFoods[index].foodQuantity--;
      setFoods(cardFoods);
      await AsyncStorage.setItem("cardFoods", JSON.stringify(cardFoods))
     }
  }
  // food delete from cardFoods
  const foodDelete = async (index) => {
    const cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
    cardFoods.splice(index, 1)
    setFoods(cardFoods);
    await AsyncStorage.setItem("cardFoods", JSON.stringify(cardFoods))
  }

  // capitalizeEachWord
  function capitalizeEachWord(str) {
    // Split the string into an array of words
    const words = str.split(' ');

    // Capitalize the first letter of each word
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the words back into a string
    const capitalizedString = capitalizedWords.join(' ');

    return capitalizedString;
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
              <IoIcon style={{ paddingLeft: 10 }} name="search" size={27} color="#000" />
              <TextInput placeholder="Search" />
            </Pressable>
            {employee && <TouchableOpacity onPress={() => setLogOutModal(true)}>
              <IoIcon style={{ paddingLeft: 0 }} name="power" size={28} color="#000" />
            </TouchableOpacity>}

            {!employee && <TouchableOpacity onPress={() => setLogInModal(true)}>
              <IoIcon style={{ paddingLeft: 0 }} name="person-circle-outline" size={30} color="#000" />
            </TouchableOpacity>}
          </View>
          <Text style={{
            fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
          }}>Please Order your Food</Text>

          {/* Card Item */}
          <ScrollView style={{ marginBottom: 100 }}>
            {
              foods.map((food, index) => {
                return (
                  <View key={index} style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
                    <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius: 5 }} source={{ uri: food.foodimg.length > 0 ? food.foodimg : "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                    <View style={{ width: "60%", padding: 10, justifyContent: "space-between", marginLeft: 20 }}>
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Name : {capitalizeEachWord(food.foodname)}</Text>
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Price : ₹{food.foodprice}</Text>
                      <View style={{ flexDirection: "row" }}>

                        <TouchableOpacity onPress={() => foodQuantityMinus(index)} style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: "orange", alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>{food.foodQuantity}</Text>
                        <TouchableOpacity onPress={() => foodQuantityPlus(index)} style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: "orange", alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
                          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => foodDelete(index)} style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: "orange", alignItems: "center", justifyContent: "center", marginLeft: 40 }}>
                          <IoIcon name="trash" size={19} style={{ color: "white" }} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
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
            <TouchableOpacity disabled={total > 0 ? false : true} onPress={() => total > 0 && setModalVisible(true)} style={{ marginTop: 5, height: 40, backgroundColor: "orange", opacity: total > 0 ? null : 0.5, width: "100%", borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
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
                <TouchableOpacity onPress={() => setModalVisible(false)}>
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
                }} onPress={() => coinPorcess(total)}>
                  <Text style={{ fontSize: 17, fontWeight: 500,color:"white" }}>Coin</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor: "orange",
                  height: 40,
                  width: 80,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }} onPress={() => paymentProcess(total)}>
                  <Text style={{ fontSize: 17, fontWeight: 500,color:"white" }}>Rupees</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {/*success modal section */}
      <View style={{
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

      }}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={successModal}
          onRequestClose={() => {
            // Handle modal close
            setSuccessModal(!successModal);
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
              width: "80%",
              borderWidth: isLoading?0:1,
              borderColor: "green",
              borderRadius: 20,
              overflow: "hidden",
              alignItems: 'center',
            }}>
              
             {isLoading&& <View style={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
              <ActivityIndicator size="large" color="green" />
              </View>}
              {!isLoading&&<View style={{ width: "100%" }}>
                <View style={{
                  width: "100%", height: 120, backgroundColor: "green",
                  display: "flex", justifyContent: "center",
                  alignItems: "center",
                }}>
                  <IoIcon name="checkmark-circle-outline" size={110} color="white" />
                </View>
                <View style={{ width: "100%", height: 100 }}>
                  <Text style={{ marginTop: 5, fontSize: 25, fontWeight: 500, color: "green", textAlign: "center" }}>Success!</Text>
                  <Text style={{ fontSize: 15, fontWeight: 500, textAlign: "center", marginVertical: 5 }}>payment has been successful</Text>
                </View>
              </View>}
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