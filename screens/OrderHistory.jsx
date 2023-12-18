import { View, TextInput, Image, Pressable, Text, ScrollView, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import foodContext from '../components/context/foods/foodContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { EmployeeId, getUserOrderHistory } from '../utils/APIRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export default function OrderHistory() {
  const [employee, setEmployee] = useState(null)
  const { setLogOutModal, logInModal, logOutModal, setLogInModal } = useContext(foodContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const {setReviewPageModal}=useContext(foodContext);
  const navigation=useNavigation();

  useFocusEffect(useCallback(() => {
    const fetchOrderHistory = async () => {
      setIsLoading(true);
      const userid = await AsyncStorage.getItem("UserId");
      const data = await axios.post(getUserOrderHistory, {
        UserId: userid,
        EmployeeId: EmployeeId
      })
      setOrderHistory(data.data);
      setIsLoading(false);
      console.log(data.data);
    }
    fetchOrderHistory();
  }, []))
  const fetchempid = async () => {
    const localemp = await AsyncStorage.getItem("employee");
    setEmployee(localemp);
  }
  useEffect(() => {
    fetchempid();
  }, [logOutModal, logInModal])


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
async function setFoodToLocal (foodid){
  await AsyncStorage.setItem("food_id",foodid)
  setReviewPageModal(true)
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
          <Icon style={{ paddingLeft: 10 }} name="search" size={27} color="#000" />
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
      }}>Your Order History</Text>
      <ScrollView>
        {
          orderHistory.map((Order, index) => {
            return (
              <View key={index} style={{ paddingBottom: 10, margin: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
                <Pressable onPress={()=>setFoodToLocal(Order.food_id)} style={{width:"40%"}}>
                <Image style={{ height: 130, width: "100%", resizeMode: "contain", borderRadius: 5 }} source={{ uri: Order.foodimg.length > 0 ? Order.foodimg : "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                </Pressable>
                <View style={{ width: "60%", paddingHorizontal: 15 }}>
                  <View >
                   {Order.rejected?<Icon name="close-circle-outline" size={20} color="red"/>:<Icon name="checkmark-circle-outline" size={20} color="green"/>}
                    <Text style={{ fontSize: 20, fontWeight: "500", marginTop: 5 }}>{capitalizeEachWord(Order.foodname)} :: ₹{Order.foodprice}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Total : {Order.foodprice}X{Order.foodQuantity}=₹{Order.foodprice * Order.foodQuantity}</Text>
                    <Text style={{ fontSize: 15, fontWeight: "bold",marginTop:5 }}>{Order.date.toString().substring(0, 19)}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>orderId : {Order.order_id}</Text>
                  </View>
                </View>
              </View>
            )
          })
        }
        {isLoading&&<ActivityIndicator size={'large'}/>}
      </ScrollView>
    </SafeAreaView>
  )
}