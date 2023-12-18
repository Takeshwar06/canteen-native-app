import { View, TextInput, Image, Pressable, Text, ScrollView, TouchableOpacity, Button, ActivityIndicator, Modal } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import FIcon from 'react-native-vector-icons/Ionicons';
import foodContext from '../components/context/foods/foodContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { EmployeeId, getFoodById } from '../utils/APIRoutes';


export default function FoodRatting() {
  const navigation=useNavigation();
  const [employee, setEmployee] = useState(null)
  const { setLogOutModal, logInModal, logOutModal, setLogInModal } = useContext(foodContext);
  const [foodDetails, setFoodDetails] = useState(undefined);
  const [currentIndex,setCurrentIndex]=useState(null);
  const [currentImageArray,setCurrentImageArray]=useState([])
  const [imageModal,setImageModal]=useState(false);


  useFocusEffect(useCallback(() => {
    fetchData();
  }, []))
  const fetchData = async () => {
    const foodId = await AsyncStorage.getItem("food_id");
    if (foodId) {
      const response = await axios.get(`${getFoodById}/${foodId}`)
      console.log(response.data);
      if (response.data.length > 0) {
        setFoodDetails(response.data[0]);
      }
    }else{
      navigation.navigate("Home")
    }
  }
  const fetchempid = async () => {
    const localemp = await AsyncStorage.getItem("employee");
    setEmployee(localemp);
  }
  useEffect(() => {
    fetchempid();
  }, [logOutModal, logInModal])


  // add to card
  const addToCard = async (food) => {
    console.log("food_id",food.food_id,food._id)
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
  return (
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
         <TouchableOpacity onPress={()=>setImageModal(false)} style={{marginLeft:10,position:"absolute",zIndex:4}}><FIcon name="arrow-back-outline" color="white" size={40} /></TouchableOpacity>
         <View style={{
          flex: 1,
          height:"100%",
          width:"100%",
          justifyContent:"center",
          alignItems:"center",
          backgroundColor: "black"
        }}>
          <View style={{paddingHorizontal:20, width:"100%",position:"absolute",zIndex:2,flexDirection:"row",justifyContent:"space-between"}}>
          <TouchableOpacity onPress={()=>{currentIndex>0&&setCurrentIndex(currentIndex-1)}}><FIcon name="chevron-back-outline" size={40}/></TouchableOpacity>
          <TouchableOpacity onPress={()=>{currentIndex<currentImageArray.length-1&&setCurrentIndex(currentIndex+1)}}><FIcon name="chevron-forward-outline" size={40}/></TouchableOpacity>
          </View>
        <Image style={{width:"90%",height:"90%"}} source={{uri:currentImageArray[currentIndex]}} />
        </View>
      </Modal>
      {/* alert message here */}
      {currentAlert && (
        <View style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#97f7c2', padding: 10, zIndex: 5,
          flexDirection:"row",justifyContent:"space-between",borderWidth:2,borderColor:"green",
          borderRadius:7
         }}>
          <Text style={{ color: 'black',fontWeight:500 }}>{currentAlert}</Text>
          <FIcon name="close-circle-outline" size={24} color="black"/>
        </View>
      )}


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
          <FIcon style={{ paddingLeft: 10 }} name="search" size={27} color="#000" />
          <TextInput placeholder="Search" />
        </Pressable>
        {employee && <TouchableOpacity onPress={() => setLogOutModal(true)}>
          <FIcon style={{ paddingLeft: 0 }} name="power" size={28} color="#000" />
        </TouchableOpacity>}

        {!employee && <TouchableOpacity onPress={() => setLogInModal(true)}>
          <FIcon style={{ paddingLeft: 0 }} name="person-circle-outline" size={30} color="#000" />
        </TouchableOpacity>}
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
                <FIcon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate+foodDetails.hygienicRate+foodDetails.qualityRate)/foodDetails.totalRate)*5>0?"star":"star-outline"} size={20} />
                <FIcon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate+foodDetails.hygienicRate+foodDetails.qualityRate)/foodDetails.totalRate)*5>1?"star":"star-outline"} size={20} />
                <FIcon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate+foodDetails.hygienicRate+foodDetails.qualityRate)/foodDetails.totalRate)*5>2?"star":"star-outline"} size={20} />
                <FIcon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate+foodDetails.hygienicRate+foodDetails.qualityRate)/foodDetails.totalRate)*5>3?"star":"star-outline"} size={20} />
                <FIcon style={{ marginRight: 5 }} color={"orange"} name={((foodDetails.testRate+foodDetails.hygienicRate+foodDetails.qualityRate)/foodDetails.totalRate)*5>4?"star":"star-outline"} size={20} />
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
                  <View style={{ borderRadius: 100, backgroundColor:(foodDetails.testRate/(foodDetails.totalRate/3))*100>=90?"green":(foodDetails.testRate/(foodDetails.totalRate/3))*100<90&&(foodDetails.testRate/(foodDetails.totalRate/3))*100>=50?"#48f03c":(foodDetails.testRate/(foodDetails.totalRate/3))*100<50&&(foodDetails.testRate/(foodDetails.totalRate/3))*100>=30?"#f56f36":(foodDetails.testRate/(foodDetails.totalRate/3))*100<30&&(foodDetails.testRate/(foodDetails.totalRate/3))*100>0?"red":"grey", height: 7, width: `${(foodDetails.testRate/(foodDetails.totalRate/3))*100}%` }}></View>
                </View>
                <Text style={{ marginLeft: 7, fontSize: 15, fontWeight: 500 }}>{(foodDetails.testRate/(foodDetails.totalRate/3))*100}%</Text>
              </View>
              {/* Hygienic rating */}
              <View style={{ height: 25, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: "23%", fontSize: 17, fontWeight: 500 }}>Hygienic</Text>
                <View style={{ borderRadius: 100, backgroundColor: "#f0e5e4", height: 7, width: "70%" }}>
                  <View style={{ borderRadius: 100, backgroundColor:(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100>=90?"green":(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100<90&&(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100>=50?"#48f03c":(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100<50&&(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100>=30?"#f56f36":(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100<30&&(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100>0?"red":"grey", height: 7, width: `${(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100}%` }}></View>
                </View>
                <Text style={{ marginLeft: 7, fontSize: 15, fontWeight: 500 }}>{(foodDetails.hygienicRate/(foodDetails.totalRate/3))*100}%</Text>
              </View>
              {/* Quality rating */}
              <View style={{ height: 25, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: "23%", fontSize: 17, fontWeight: 500 }}>Quality</Text>
                <View style={{ borderRadius: 100, backgroundColor: "#f0e5e4", height: 7, width: "70%" }}>
                  <View style={{ borderRadius: 100, backgroundColor:(foodDetails.qualityRate/(foodDetails.totalRate/3))*100>=90?"green":(foodDetails.qualityRate/(foodDetails.totalRate/3))*100<90&&(foodDetails.qualityRate/(foodDetails.totalRate/3))*100>=50?"#48f03c":(foodDetails.qualityRate/(foodDetails.totalRate/3))*100<50&&(foodDetails.qualityRate/(foodDetails.totalRate/3))*100>=30?"#f56f36":(foodDetails.qualityRate/(foodDetails.totalRate/3))*100<30&&(foodDetails.qualityRate/(foodDetails.totalRate/3))*100>0?"red":"grey", height: 7, width: `${(foodDetails.qualityRate/(foodDetails.totalRate/3))*100}%` }}></View>
                </View>
                <Text style={{ marginLeft: 7, fontSize: 15, fontWeight: 500 }}>{(foodDetails.qualityRate/(foodDetails.totalRate/3))*100}%</Text>
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
                    {item.commentText.length>0&&<Text style={{ fontSize: 15, color: "black" }}>{item.commentText}</Text>}
                    {/* commnet image */}
                    <ScrollView style={{ marginBottom: 10, width: "100%", flexDirection: "row" }} horizontal showsHorizontalScrollIndicator={false}>
                      {
                        item.commentImage.map((uploadedImage,index) => {
                          return (
                            <TouchableOpacity onPress={()=>{
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
          <TouchableOpacity onPress={()=>{foodDetails&&addToCard(foodDetails)}} style={{ marginTop: 0, height: 40, backgroundColor: "orange", width: "100%", borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </>}
      {!foodDetails&&<ActivityIndicator size={"large"}/>}
    </SafeAreaView>
  )
}