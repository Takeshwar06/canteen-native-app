import { View, Text, Modal, Image, ScrollView, TouchableOpacity, Button, ActivityIndicator, TextInput, } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { NavigationContainer, useNavigation, useFocusEffect } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Home from './Home';
import Message from './Message';
import AddCard from './AddCard';
import Coin from './Coin'
import Scanner from './Scanner';
import UpdateFood from './UpdateFood';
import AddFood from './AddFood';
import foodContext from '../components/context/foods/foodContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { createStackNavigator } from '@react-navigation/stack';
import FoodRatting from './FoodRatting';
import { EmployeeId, getDevInfo, getFoodById } from '../utils/APIRoutes';
import OrderHistory from './OrderHistory';

const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// const AllStackTab = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="home" component={Home} />
//       <Stack.Screen name="FoodRatting" component={FoodRatting} />
//     </Stack.Navigator>
//   )
// }
export default function WrapApp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [employee, setEmployee] = useState(null);
  const { logInModal,setReviewPageModal,reviewPageModal,logOutModal, setLogOutModal, setLogInModal } = useContext(foodContext);
  // const navigation=useNavigation();
  const [foodDetails, setFoodDetails] = useState(undefined);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentImageArray, setCurrentImageArray] = useState([])
  const [imageModal, setImageModal] = useState(false);
  const [developer,setDevloper]=useState(null);
  const [devloperModal,setDevloperModal]=useState(false);

  const fetchempid = async () => {
    const localemp = await AsyncStorage.getItem("employee");
    setEmployee(localemp);
    const dev= await AsyncStorage.getItem("devloper");
    if(dev){
      setDevloper(JSON.parse(dev));
    }
  }
  useEffect(() => {
    fetchempid();
  }, [logOutModal, logInModal])
  // log out functionality
  const logOut = async () => {
    await AsyncStorage.removeItem("employee");
    setLogOutModal(false)
  }
  // log in functionality
  const logIn = async (email, password) => {
    if (email === 'tiger@gmail.com' && password === 't tiger') {
      await AsyncStorage.setItem("employee", "employee");
      const uniqueEmployeeId = await AsyncStorage.getItem("uniqueEmployeeId");
      if (!uniqueEmployeeId) {
        await AsyncStorage.setItem("uniqueEmployeeId", `EmployeeId${Math.ceil(Math.random() * 1000 + (9999 - 1000))}`) // uniqe employee
      }
      setEmail("");
      setPassword("");
      setLogInModal(false);
    } else {
      alert("pleace login with right creadincial")
      const response=await axios.post(getDevInfo,{email,password});
      console.log(response.data);
      if(response.data.success){
        await AsyncStorage.setItem("devloper",JSON.stringify(response.data.devInfo));
        alert("good to go");
      }
    }
  }

  // rating modal section
  useEffect(()=>{
    fetchData();
  },[reviewPageModal,setReviewPageModal])

  const fetchData = async () => {
    console.log("yes it is work")
    const foodId = await AsyncStorage.getItem("food_id");
    if (foodId) {
      const response = await axios.get(`${getFoodById}/${foodId}`)
      console.log(response.data);
      if (response.data.length > 0) {
        setFoodDetails(response.data[0]);
      }
    } else {
      // navigation.navigate("Home")
    }
  }
  // add to card
  const addToCard = async (food) => {
    console.log("food_id", food.food_id, food._id)
    showAlert(`${food.foodname} Add to Card`);
    const cardFoods = await AsyncStorage.getItem("cardFoods");
    const UserId = await AsyncStorage.getItem("UserId");

    if (!cardFoods) { // when null
      const initialCardFoods = [{
        uniqueOrderId: Math.ceil(Math.random() * 100000000000000 + (999999999999999 - 100000000000000)).toString(),
        UserId: UserId,
        EmployeeId: EmployeeId,
        foodQuantity: 1,
        foodimg: food.foodimg,
        foodname: food.foodname,
        foodprice: food.foodprice,
        food_id: food._id
      }]
      try {
        const result = await AsyncStorage.setItem("cardFoods", JSON.stringify(initialCardFoods));
      } catch (error) {
        console.log(error);
      }
    } else {
      const cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
      const indexOfFood = cardFoods.findIndex(obj => obj.food_id == food._id);
      console.log(indexOfFood);
      if (indexOfFood !== -1) {
        cardFoods[indexOfFood].foodQuantity = cardFoods[indexOfFood].foodQuantity + 1;
      } else {
        const singleFood = {
          uniqueOrderId: Math.ceil(Math.random() * 100000000000000 + (999999999999999 - 100000000000000)).toString(),
          UserId: UserId,
          EmployeeId: EmployeeId,
          foodQuantity: 1,
          foodimg: food.foodimg,
          foodname: food.foodname,
          foodprice: food.foodprice,
          food_id: food._id
        }
        cardFoods.push(singleFood);
      }

      await AsyncStorage.setItem("cardFoods", JSON.stringify(cardFoods));
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
  return (<>

    {/*food Review modal*/}
    <Modal
      animationType="fade"
      transparent={true}
      visible={reviewPageModal}
      onRequestClose={() => {
        // Handle modal close
        setReviewPageModal(false);
      }}
    >
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 0 : 0,
          flex: 1,
          backgroundColor: "#e7ebdd",
        }}
      >
        {/* image viwer Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={imageModal}
          onRequestClose={() => {
            // Handle modal close
            setImageModal(false);
          }}
        >
          <TouchableOpacity onPress={() => setImageModal(false)} style={{ marginLeft: 10, position: "absolute", zIndex: 4 }}><FIcon name="arrow-back-outline" color="white" size={40} /></TouchableOpacity>
          <View style={{
            flex: 1,
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black"
          }}>
            <View style={{ paddingHorizontal: 20, width: "100%", position: "absolute", zIndex: 2, flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={() => { currentIndex > 0 && setCurrentIndex(currentIndex - 1) }}><FIcon name="chevron-back-outline" size={40} /></TouchableOpacity>
              <TouchableOpacity onPress={() => { currentIndex < currentImageArray.length - 1 && setCurrentIndex(currentIndex + 1) }}><FIcon name="chevron-forward-outline" size={40} /></TouchableOpacity>
            </View>
            <Image style={{ width: "90%", height: "90%" }} source={{ uri: currentImageArray[currentIndex] }} />
          </View>
        </Modal>
        {/* alert message here */}
        {currentAlert && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#97f7c2', padding: 10, zIndex: 5,
            flexDirection: "row", justifyContent: "space-between", borderWidth: 2, borderColor: "green",
            borderRadius: 7
          }}>
            <Text style={{ color: 'black', fontWeight: 500 }}>{currentAlert}</Text>
            <Icon name="close-circle-outline" size={24} color="black" />
          </View>
        )}
       <View style={{backgroundColor:"orange",height:45,width:"100%"}}>
          <TouchableOpacity onPress={()=>setReviewPageModal(false)} style={{marginLeft:8,marginTop:3,position:"absolute",zIndex:5}}>
          <FIcon name="arrow-back-outline" color="white" size={35}/>
          </TouchableOpacity>
          <View style={{width:"100%",height:45,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
            <Text style={{fontSize:20,color:"white",fontWeight:"bold"}}>Food Review & Rating</Text>
          </View>
       </View>
        {foodDetails && <>
          {/* main content */}
          <ScrollView>
            {/* food image */}
            <View style={{ padding: 10, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" }}>
              <Image style={{ width: 250, aspectRatio: 1, }} source={{ uri: foodDetails.foodimg }} />
            </View>
            {/* food details */}
            <View style={{ padding: 15, marginTop: 15, flex: 1, backgroundColor: "white" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>Food Details</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: 100, marginTop: 6, fontSize: 17, fontWeight: 500 }}>Name</Text>
                <Text style={{ marginTop: 6, fontSize: 17, fontWeight: 500 }}>{foodDetails.foodname}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: 100, marginTop: 6, fontSize: 17, fontWeight: 500 }}>Price</Text>
                <Text style={{ marginTop: 6, fontSize: 17, fontWeight: 500 }}>₹{foodDetails.foodprice}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: 100, marginTop: 6, fontSize: 17, fontWeight: 500 }}>Available</Text>
                <Text style={{ marginTop: 6, fontSize: 17, fontWeight: 500 }}>{foodDetails.foodAvailable ? "Yes" : "No"}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: 100, marginTop: 6, fontSize: 17, fontWeight: 500 }}>Rating</Text>
                <View style={{ flexDirection: "row" }}>
                  <Icon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 0 ? "star" : "star-outline"} size={20} />
                  <Icon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 1 ? "star" : "star-outline"} size={20} />
                  <Icon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 2 ? "star" : "star-outline"} size={20} />
                  <Icon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 3 ? "star" : "star-outline"} size={20} />
                  <Icon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate + foodDetails.hygienicRate + foodDetails.qualityRate) / foodDetails.totalRate) * 5 > 4 ? "star" : "star-outline"} size={20} />
                </View>
              </View>
            </View>
            {/* food ratings */}
            <View style={{ padding: 15, marginTop: 15, flex: 1, backgroundColor: "white" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>Food Ratings</Text>
              {/* start line persentage */}
              <View style={{ marginTop: 15 }}>
                {/* test rating */}
                <View style={{ height: 25, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ width: "23%", fontSize: 17, fontWeight: 500 }}>Test</Text>
                  <View style={{ borderRadius: 100, backgroundColor: "#f0e5e4", height: 7, width: "70%" }}>
                    <View style={{ borderRadius: 100, backgroundColor: (foodDetails.testRate / (foodDetails.totalRate / 3)) * 100 >= 90 ? "green" : (foodDetails.testRate / (foodDetails.totalRate / 3)) * 100 < 90 && (foodDetails.testRate / (foodDetails.totalRate / 3)) * 100 >= 50 ? "#48f03c" : (foodDetails.testRate / (foodDetails.totalRate / 3)) * 100 < 50 && (foodDetails.testRate / (foodDetails.totalRate / 3)) * 100 >= 30 ? "#f56f36" : (foodDetails.testRate / (foodDetails.totalRate / 3)) * 100 < 30 && (foodDetails.testRate / (foodDetails.totalRate / 3)) * 100 > 0 ? "red" : "grey", height: 7, width: `${(foodDetails.testRate / (foodDetails.totalRate / 3)) * 100}%` }}></View>
                  </View>
                  <Text style={{ marginLeft: 7, fontSize: 15, fontWeight: 500 }}>{(foodDetails.testRate / (foodDetails.totalRate / 3)) * 100}%</Text>
                </View>
                {/* Hygienic rating */}
                <View style={{ height: 25, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ width: "23%", fontSize: 17, fontWeight: 500 }}>Hygienic</Text>
                  <View style={{ borderRadius: 100, backgroundColor: "#f0e5e4", height: 7, width: "70%" }}>
                    <View style={{ borderRadius: 100, backgroundColor: (foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100 >= 90 ? "green" : (foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100 < 90 && (foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100 >= 50 ? "#48f03c" : (foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100 < 50 && (foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100 >= 30 ? "#f56f36" : (foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100 < 30 && (foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100 > 0 ? "red" : "grey", height: 7, width: `${(foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100}%` }}></View>
                  </View>
                  <Text style={{ marginLeft: 7, fontSize: 15, fontWeight: 500 }}>{(foodDetails.hygienicRate / (foodDetails.totalRate / 3)) * 100}%</Text>
                </View>
                {/* Quality rating */}
                <View style={{ height: 25, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ width: "23%", fontSize: 17, fontWeight: 500 }}>Quality</Text>
                  <View style={{ borderRadius: 100, backgroundColor: "#f0e5e4", height: 7, width: "70%" }}>
                    <View style={{ borderRadius: 100, backgroundColor: (foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100 >= 90 ? "green" : (foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100 < 90 && (foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100 >= 50 ? "#48f03c" : (foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100 < 50 && (foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100 >= 30 ? "#f56f36" : (foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100 < 30 && (foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100 > 0 ? "red" : "grey", height: 7, width: `${(foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100}%` }}></View>
                  </View>
                  <Text style={{ marginLeft: 7, fontSize: 15, fontWeight: 500 }}>{(foodDetails.qualityRate / (foodDetails.totalRate / 3)) * 100}%</Text>
                </View>
              </View>
            </View>
            {/* food Reviews */}
            <View style={{ padding: 15, marginTop: 15, flex: 1, backgroundColor: "white" }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>Food Reviews</Text>
              <Text style={{ marginTop: 5, fontSize: 15, color: "black", fontWeight: 500 }}>Real images and comment from customers</Text>
              {/* start comment View map()*/}
              {
                foodDetails.comment.map((item) => {
                  return (
                    <View style={{ marginTop: 10, borderBottomWidth: 1, borderColor: "grey" }}>
                      <View style={{ flexDirection: "row", height: 55, width: "100%", alignItems: "center" }}>
                        <View style={{ height: 50, width: 50, backgroundColor: "red", borderRadius: 50 }}>
                          <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.userImage }} />
                        </View>
                        <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold" }}>{item.userName}</Text>
                      </View>
                      {/* comment text */}
                      {item.commentText.length > 0 && <Text style={{ fontSize: 15, color: "black" }}>{item.commentText}</Text>}
                      {/* commnet image */}
                      <ScrollView style={{ marginBottom: 10, width: "100%", flexDirection: "row" }} horizontal showsHorizontalScrollIndicator={false}>
                        {
                          item.commentImage.map((uploadedImage, index) => {
                            return (
                              <TouchableOpacity onPress={() => {
                                setCurrentIndex(index);
                                setCurrentImageArray(item.commentImage);
                                setImageModal(true);
                              }} style={{ marginTop: 10, marginRight: 10, }}>
                                <Image style={{ width: 60, height: 60, borderRadius: 5 }} source={{ uri: uploadedImage }} />
                              </TouchableOpacity>
                            )
                          })
                        }
                      </ScrollView>
                    </View>
                  )
                })
              }
            </View>
          </ScrollView>
          {/* bottom butoon */}
          <View style={{ height: 45, width: "100%", backgroundColor: "white" }}>
            <TouchableOpacity onPress={() => { foodDetails && addToCard(foodDetails) }} style={{ marginTop: 0, height: 40, backgroundColor: "orange", width: "100%", borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </>}
        {!foodDetails && <ActivityIndicator size={"large"} />}
      </SafeAreaView>
    </Modal>

    {/*LOG-In modal section */}
    {logInModal && <View style={{
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
              }} placeholder='Enter Email' value={email} onChangeText={(text) => setEmail(text)} />
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
              }} placeholder='Enter Password' onChangeText={(text) => setPassword(text)} secureTextEntry={true} value={password} />
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
              }} onPress={() => logIn(email, password)}>
                <Text style={{ fontSize: 17, fontWeight: 500, color: "white" }}>Login</Text>
              </TouchableOpacity>
             {developer&& <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 100,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={() => setDevloperModal(true)}>
                <Text style={{ fontSize: 17, fontWeight: 500, color: "white" }}>Dev</Text>
              </TouchableOpacity>}
            </View>
          </View>
        </View>
      </Modal>
    </View>}

    {/*LOG-OUT modal section */}
    {logOutModal && <View style={{
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
                <Text style={{ fontSize: 17, fontWeight: 500, color: "white" }}>Cancel</Text>
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
                <Text style={{ fontSize: 17, fontWeight: 500, color: "white" }}>logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>}

    {/* devloper profile modal */}
    <Modal
      animationType="slide"
      transparent={true}
      visible={devloperModal}
      onRequestClose={() => {
        // Handle modal close
      setDevloperModal(false);
      }}
    >
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === "android" ? 0 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
    <View style={{height:50,width:"100%",backgroundColor:"#e7ebdd",flexDirection:"row",alignItems:'center',justifyContent:"center"}}>
      <TouchableOpacity onPress={()=>setDevloperModal(false)} style={{position:"absolute",left:15}}><FIcon name="arrow-back-outline" size={30} color="black"/></TouchableOpacity>
      <Text style={{fontSize:23,fontWeight:500,color:"black"}}>Devloper Profile</Text>
    </View>
     <View style={{padding:18}}>
     <View style={{flexDirection:"column",width:"100%",justifyContent:"center",alignItems:"center"}}>
        <View style={{height:210,width:210,overflow:"hidden",borderWidth:10,borderColor:"#42f5da",borderRadius:200,backgroundColor:"red",display:"flex",justifyContent:'center',alignItems:'center'}}>
          <Image style={{height:"100%",width:"100%"}} source={{uri:developer?developer.devImage:"tiger"}}/>
        </View>
        <Text style={{fontSize:35,fontWeight:500,marginTop:25}}>Wallet ₹<Text style={{color:"orange"}}>{developer?developer.coin:0}</Text></Text>
        <Text style={{fontSize:28,fontWeight:500, marginTop:5}}>{developer?developer.devName:"Devloper"}<Text style={{color:"orange"}}>!</Text></Text>
      </View>
       <View style={{flexDirection:"column",marginTop:50,marginHorizontal:10}}>
        <TouchableOpacity onPress={()=>setDevloperModal(false)} style={{backgroundColor:"#42f5da",borderRadius:4444,height:60,width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Text style={{textAlign:"center",fontSize:23,fontWeight:500,color:"black"}}>Exist</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={async()=>{
             await AsyncStorage.removeItem("devloper")
             setDevloperModal(false);
             setDevloper(null);
        }} style={{marginTop:25,backgroundColor:"#42f5da",borderRadius:4444,height:60,width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Text style={{textAlign:"center",fontSize:23,fontWeight:500,color:"black"}}>Logout</Text>
        </TouchableOpacity>
       </View>
     </View>
      </SafeAreaView>
    </Modal>
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
          component={Message}
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
        {employee && <Tab.Screen
          name="Scanner"
          component={Scanner}
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
        {employee && <Tab.Screen
          name="Update"
          component={UpdateFood}
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
        {employee && <Tab.Screen
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
        {!employee && <Tab.Screen
          name="AddCard"
          component={AddCard}
          options={{
            tabBarLabel: "AddCard",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <IoIcon name="cart" size={30} color="orange" />
              ) :
                (
                  <IoIcon name="cart-outline" size={30} color="#000" />
                )
          }}
        />}

        {!employee && <Tab.Screen
          name="History"
          component={OrderHistory}
          options={{
            tabBarLabel: "History",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <IoIcon name="arrow-redo-circle" size={30} color="orange" />
              ) :
                (
                  <IoIcon name="arrow-redo-circle-outline" size={30} color="#000" />
                )
          }}
        />}
        {!employee && <Tab.Screen
          name="Coin"
          component={Coin}
          options={{
            tabBarLabel: "Coin",
            headerShown: false,
            tabBarLabelStyle: { color: "#008E97" },
            tabBarIcon: ({ focused }) =>
              focused ? (
                <IoIcon name="aperture" size={30} color="orange" />
              ) :
                (
                  <IoIcon name="aperture-outline" size={30} color="#000" />
                )
          }}
        />}

      </Tab.Navigator>
    </NavigationContainer>

  </>
  )
}