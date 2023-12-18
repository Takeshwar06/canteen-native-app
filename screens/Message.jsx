import { View, Text, Image, Modal, TextInput, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import IoIcon from 'react-native-vector-icons/Ionicons';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {  expireQr, getAllOrderForEmployee,  host,  updateOrder, updateReject, updateTake, EmployeeId, getAllOrderForUser, updateDeleted, upDateRating, upDateRated, coinPlus } from '../utils/APIRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import axios from 'axios';
import foodContext from '../components/context/foods/foodContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Message() {
  const socket = useRef();
  const [userOrder, setUserOrder] = useState([]);
  const [employeeOrder, setEmployeeOrder] = useState([]);
  const [UserId, setUserId] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [testRate, setTestRate] = useState(0)
  const [hygienicRate, setHygienicRate] = useState(0)
  const [qualityRate, setQualityRate] = useState(0);
  const [commentText, setCommentText] = useState("")
  const [commentImage, setCommentImage] = useState([])
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [uniqueEmployeeId, setUniqueEmployeeId] = useState(null);
  const [currnetFood, setCurrentFood] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setLogOutModal, logInModal, logOutModal, setLogInModal } = useContext(foodContext);
  const {setReviewPageModal}=useContext(foodContext);
  const navigation=useNavigation();

  // socket connect when  user enter this screep
  const fetchempid = async () => {
    const localemp = await AsyncStorage.getItem("employee");
    setEmployee(localemp);
  }
  useEffect(() => {
    fetchempid();
  }, [logOutModal, logInModal])

  useFocusEffect(useCallback(() => {
    console.log("first")
    socket.current = io(host)
    fetchUserData();
    initailizeSocket();
    sendOrderToSocket();
  }, []))

  const initailizeSocket = async () => {
    const userid = await AsyncStorage.getItem("UserId");
    setUserId(userid);
    const isemployee = await AsyncStorage.getItem("employee")
    setEmployee(isemployee);
    socket.current.emit("add-user", userid)
    if (isemployee) {
      const uniqueEmployee = await AsyncStorage.getItem("uniqueEmployeeId")
      setUniqueEmployeeId(uniqueEmployee)
      socket.current.emit("add-employee", uniqueEmployee);
      fetchEmployeeData();
    }
  }
  // sending order to socket
  const sendOrderToSocket = async () => {
    const referenceNum = await AsyncStorage.getItem("referenceNum");
    if (referenceNum) {
      const cardFoods = JSON.parse(await AsyncStorage.getItem("cardFoods"));
      if (cardFoods) {
        socket.current.emit("send-order", {
          cardFoods, referenceNum
        })
        // addOrder(cardFoods,referenceNum);
        fetchUserData();
        await AsyncStorage.removeItem("referenceNum")
        await AsyncStorage.removeItem("cardFoods")
      }
    }
  }

  // delet order by user
  const orderDeleted = async (Order, index) => {
    const data = [...userOrder]
    data.splice(index, 1);
    setUserOrder(data);
    let response = await axios.post(`${updateDeleted}/${Order.uniqueOrderId}`, { deleted: true })
    //  fetchdata();
  }

  // fetching user data 
  const fetchUserData = async () => {
    console.log("fetchUserData called")
    const userid = await AsyncStorage.getItem("UserId")
    let response = await axios.post(getAllOrderForUser, {
      UserId: userid,
      EmployeeId: EmployeeId
    })
    setUserOrder(response.data);
  }
  // when rejected order by employee
  useEffect(() => {
    console.log("second")
    socket.current.on("rejected-order", async (data) => {
      console.log("rejected-orderr before check user id")
      const userid = await AsyncStorage.getItem("UserId")
      if (userid == data.auth[0]) {
        console.log("rejected-orderr after check user id")
        setUserOrder((preOrder) => {
          return preOrder.map((element) => {
            if (element.uniqueOrderId == data.uniqueOrderId) {
              return { ...element, rejected: true, QRvalid: false }
            }
            return element;
          })
        })
        // const tempUserOrder = [...userOrder]
        // tempUserOrder.forEach((element, index) => {
        //   if (element.uniqueOrderId == data.uniqueOrderId) {
        //     tempUserOrder[index].rejected = true;
        //     tempUserOrder[index].QRvalid = false;
        //     setUserOrder(tempUserOrder);
        //   }
        // })
      }
    })
  }, [])

  // after completed order
  useEffect(() => {
    socket.current.on("completed-order", async (data) => {
      console.log("completed-order before check user id");
      const userid = await AsyncStorage.getItem("UserId")
      if (userid == data.auth[0]) {
        console.log("completed-order after check user id");
        setUserOrder((preOrder) => {
          return preOrder.map((element) => {
            if (element.uniqueOrderId == data.uniqueOrderId) {
              return { ...element, placed: true }
            }
            return element;
          })
        })
        // const tempUserOrder = [...userOrder]
        // userOrder.forEach((element, index) => {
        //   if (element.uniqueOrderId == data.uniqueOrderId) {
        //     tempUserOrder[index].placed = true;
        //     setUserOrder(tempUserOrder);
        //   }
        // })
      }
    })
  }, [])


  // now this part for employee *****************||***************
  const fetchEmployeeData = async () => {
    const response = await axios.post(getAllOrderForEmployee)
    setEmployeeOrder(response.data);
  }
  // clicking coplete Order
  const upDateOrder = async (order, index) => {
    const data = [...employeeOrder];
    data.splice(index, 1);
    const response = await axios.post(`${updateOrder}/${order.uniqueOrderId}`, { placed: true })
    socket.current.emit("complete-order", order);
    setEmployeeOrder(data);
    // empfetchdata();
  }
  // cliking reject Order
  const rejectOrder = async (order, index) => {
    const data = [...employeeOrder];
    data.splice(index, 1);
    setEmployeeOrder(data);
    socket.current.emit("reject-order", order);
    await axios.post(`${updateReject}/${order.uniqueOrderId}`, { rejected: true })
    await axios.post(`${expireQr}/${order.uniqueOrderId}`)

    const response = await axios.post(coinPlus, {
      userId: order.auth[0],
      updatedCoin: (order.foodprice * order.foodQuantity)
    })
  }
  // when taking order by employye
  const takeOrder = async (order, employeeId, index) => {
    if (employeeId) {
      socket.current.emit("take-order", { order, employeeId, index });
      const data = [...employeeOrder];
      data[index].take.notTaken = false;
      data[index].take.takenByMe = employeeId;
      setEmployeeOrder(data);
      const response = await axios.post(`${updateTake}/${order.uniqueOrderId}`, {
        take: {
          notTaken: false,
          takenByMe: employeeId
        }
      })
    }
  }

  // after taking order by another
  useEffect(() => {
    // if (socket.current) {
    socket.current.on("took-order", async ({ order, employeeId, index }) => {
      console.log("took-order called")
      const isEmp = await AsyncStorage.getItem("employee");
      if (isEmp) {
        setEmployeeOrder((preOrder) => {
          return preOrder.map((element) => {
            if (element.uniqueOrderId == order.uniqueOrderId) {
              return {
                ...element,
                take: {
                  notTaken: false,
                  takenByMe: employeeId,
                },
              }
            }
            return element;
          })
        })
        // let data = [...employeeOrder];
        // const indexOfFood = data.findIndex(obj => obj.uniqueOrderId == order.uniqueOrderId);
        // if (indexOfFood !== -1) {
        //   order.take.notTaken = false;
        //   order.take.takenByMe = employeeId;
        //   data[indexOfFood] = order
        //   setEmployeeOrder(data);
        // }
      }
    })
    // }
  }, [])

  // when receving order from user
  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-order", (data) => {
        console.log("recieve-order called")
        let temp2 = [] // data=[...orders]
        data.cardFoods.forEach((food) => {
          let tempOrder = {
            take: { notTaken: true, takenByMe: null },
            rejected: false,
            deleted: false,
            auth: [food.UserId, food.EmployeeId],
            foodQuantity: food.foodQuantity,
            foodimg: food.foodimg,
            foodname: food.foodname,
            foodprice: food.foodprice,
            order_id: data.referenceNum,
            uniqueOrderId: food.uniqueOrderId
          }
          if (employeeOrder.length === 1) {  // using orders.length>0 concept
            //   // setOrders([...orders,tempOrder])    
            fetchEmployeeData();
          }

          temp2.push(tempOrder);
        })
        let temp1 = [...employeeOrder]
        let mergedArray = temp1.concat(temp2)
        setEmployeeOrder(mergedArray)
        // }
      })
    }

  }, [employeeOrder])

  // rating modal section
  const ratingModal = (food_id, orderid) => {
    setCurrentFood(food_id);
    setCurrentOrderId(orderid)
    setTestRate(0);
    setHygienicRate(0);
    setQualityRate(0);
    setCommentImage([]);
    setCommentText("");
    setOpenRatingModal(true);
  }

  // take photo using camera
  const uploadImageUsingCamera = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          setIsLoading(true);
          const options = {
            mediaType: 'photo',
            quality: 0.5,
          };

          launchCamera(options, (response) => {
            console.log("inside")
            if (response.didCancel) {
              console.log('User cancelled camera');
              setIsLoading(false);
            } else if (response.error) {
              setIsLoading(false);
              console.log('Camera Error:', response.error);
            } else {
              console.log('Photo taken:', response.assets[0].uri);
              uploadToCloudinary(response.assets[0].uri);
            }
          });
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  // upload image to cloudinary
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
          const imgArray = [...commentImage];
          imgArray.push(`https${data.url.substring(4)}`)
          setCommentImage(imgArray)
          setIsLoading(false);
          console.log("dataurl", data.url);
          // setImgUploaded(true);

        }) // set image 
        .catch((error) => { console.log(error); setIsLoading(false); })
    } else {
      setIsLoading(false);
      console.log("No image selected")
    }
  }

  // submiting Rating
  const submitRating = async () => {
    setIsLoading(true);
    console.log("rating called")
    if (testRate > 0 && hygienicRate > 0 && qualityRate > 0) {
      // submiting to server
      const data = [...userOrder];
      const indexOfFood = data.findIndex(obj => obj.uniqueOrderId == currentOrderId);
      data[indexOfFood].rated = true;
      setUserOrder(data);
      await axios.post(`${upDateRated}/${currentOrderId}`);

      //rating submiting
      const response = await axios.post(`${upDateRating}/${currnetFood}`, {
        testRate,
        qualityRate,
        hygienicRate,
        commentText,
        commentImage,
        userName: auth().currentUser.displayName,
        userImage:auth().currentUser.photoURL
      })
      if (response.data.success === true) {
        console.log("submit rating")
        setIsLoading(false);
        setOpenRatingModal(false);
      } else {
        setIsLoading(false);
      }
    } else {
      alert("please submit proper rating")
      setIsLoading(false);
    }
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

  async function setFoodToLocal(foodid){
    await AsyncStorage.setItem("food_id",foodid);
    setReviewPageModal(true);
  }
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >

      {/* modal section */}
      {!employee && <View style={{
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

      }}>
        {/* Rating modal */}
        <Modal
          // animationType="fade"
          // openRatingModal
          transparent={true}
          visible={openRatingModal}
          onRequestClose={() => {
            // Handle modal close
            setOpenRatingModal(false);
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
              width: "90%",
              borderWidth: 1.5,
              borderColor: "orange",
              borderRadius: 20,
              padding: 15,
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 15, }}>Please give Rate this food</Text>
              <View style={{ marginTop: 10, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 23, fontWeight: 500 }}>Test</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => setTestRate(1)}>
                    <IoIcon name={testRate > 0 ? "star" : "star-outline"} color={testRate > 0 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTestRate(2)} style={{ marginLeft: 10 }}>
                    <IoIcon name={testRate > 1 ? "star" : "star-outline"} color={testRate > 1 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTestRate(3)} style={{ marginLeft: 10 }}>
                    <IoIcon name={testRate > 2 ? "star" : "star-outline"} color={testRate > 2 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTestRate(4)} style={{ marginLeft: 10 }}>
                    <IoIcon name={testRate > 3 ? "star" : "star-outline"} color={testRate > 3 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setTestRate(5)} style={{ marginLeft: 10 }}>
                    <IoIcon name={testRate > 4 ? "star" : "star-outline"} color={testRate > 4 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginTop: 10, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 23, fontWeight: 500 }}>Hygienic</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => setHygienicRate(1)}>
                    <IoIcon name={hygienicRate > 0 ? "star" : "star-outline"} color={hygienicRate > 0 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setHygienicRate(2)} style={{ marginLeft: 10 }}>
                    <IoIcon name={hygienicRate > 1 ? "star" : "star-outline"} color={hygienicRate > 1 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setHygienicRate(3)} style={{ marginLeft: 10 }}>
                    <IoIcon name={hygienicRate > 2 ? "star" : "star-outline"} color={hygienicRate > 2 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setHygienicRate(4)} style={{ marginLeft: 10 }}>
                    <IoIcon name={hygienicRate > 3 ? "star" : "star-outline"} color={hygienicRate > 3 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setHygienicRate(5)} style={{ marginLeft: 10 }}>
                    <IoIcon name={hygienicRate > 4 ? "star" : "star-outline"} color={hygienicRate > 4 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ marginTop: 10, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 23, fontWeight: 500 }}>Quality</Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => setQualityRate(1)}>
                    <IoIcon name={qualityRate > 0 ? "star" : "star-outline"} color={qualityRate > 0 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setQualityRate(2)} style={{ marginLeft: 10 }}>
                    <IoIcon name={qualityRate > 1 ? "star" : "star-outline"} color={qualityRate > 1 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setQualityRate(3)} style={{ marginLeft: 10 }}>
                    <IoIcon name={qualityRate > 2 ? "star" : "star-outline"} color={qualityRate > 2 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setQualityRate(4)} style={{ marginLeft: 10 }}>
                    <IoIcon name={qualityRate > 3 ? "star" : "star-outline"} color={qualityRate > 3 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setQualityRate(5)} style={{ marginLeft: 10 }}>
                    <IoIcon name={qualityRate > 4 ? "star" : "star-outline"} color={qualityRate > 4 ? "orange" : "grey"} size={27} />
                  </TouchableOpacity>
                </View>
              </View>
              {/* comment input field */}
              <Text style={{ width: "100%", marginTop: 10, fontSize: 15 }}>Comment (Optional)</Text>
              <TextInput style={{
                height: 50,
                fontSize: 16,
                width: "100%",
                borderColor: 'gray',
                borderWidth: 1,
                paddingLeft: 10,
                borderRadius: 7
              }} placeholder='write comment here' value={commentText} onChangeText={text => setCommentText(text)} />
              <Text style={{ width: "100%", marginTop: 10, fontSize: 15 }}>upload photo (Optional)</Text>

              <TouchableOpacity onPress={uploadImageUsingCamera} style={{ width: "100%", height: 50, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: "#6df2f2", borderRadius: 25 }}>
                <IoIcon name='image' size={24} color="grey" />
                <Text style={{ marginLeft: 5, fontSize: 20, fontWeight: 500, color: "grey" }}>Submit Rating</Text>
              </TouchableOpacity>
              {/* uploaded image */}
              <ScrollView style={{ width: "100%", flexDirection: "row" }} horizontal showsHorizontalScrollIndicator={false}>
                {
                  commentImage.map((imgUrl, index) => {
                    return (
                      <TouchableOpacity key={index} style={{ marginTop: 10, marginLeft: 10, width: 50, height: 50 }} onPress={()=>{
                        const data=[...commentImage];
                        data.splice(index,1);
                        setCommentImage(data);
                      }}>
                        <View style={{ position: "absolute", right: 0, top: 0, zIndex: 1 }}><IoIcon name="close" size={20} color="white" /></View>
                        <Image style={{ width: 50, height: 50 }} source={{ uri: imgUrl }} />
                      </TouchableOpacity>
                    )
                  })
                }
              </ScrollView>

              <TouchableOpacity onPress={submitRating} disabled={isLoading} style={{ width: "100%", height: 50, marginTop: 10, flexDirection: "row", justifyContent: 'center', alignItems: "center", backgroundColor: isLoading ? "#c9ae95" : "orange", borderRadius: 25 }}>
                <Text style={{ fontSize: 20, fontWeight: 500, color: "white" }}>{isLoading ? <ActivityIndicator size="large" /> : "Submit Rating"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* QR modal */}
        <Modal
          // animationType="fade"
          transparent={true}
          visible={qrUrl ? true : false}
          onRequestClose={() => {
            // Handle modal close
            setQrUrl(null);
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
              width: "90%",
              borderWidth: 1.5,
              borderColor: "orange",
              borderRadius: 20,
              padding: 15,
              alignItems: 'center',
            }}>
              <View style={{ width: "100%", flexDirection: "row", position: "relative", zIndex: 1, justifyContent: 'center', }} >
                <Text style={{ textAlign: "center", position: "relative", fontWeight: 500, zIndex: 5 }}>Scan QR from food provider</Text>
              </View>
              <View style={{ height: 300, width: 300, marginBottom: 25, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Image style={{ height: 300, width: 300 }} source={{ uri: qrUrl ? qrUrl : "tiger.jpg" }} />
                <TouchableOpacity style={{
                  backgroundColor: "orange",
                  height: 40,
                  width: 80,
                  borderRadius: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }} onPress={() => setQrUrl(null)}>
                  <Text style={{ fontSize: 17, fontWeight: 500 }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>}

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
      {/* for user */}
      {!employee && <Text style={{
        fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
      }}>Use QR to get food</Text>}

      {/* for Employee */}
      {employee && <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 5, marginHorizontal: 10, }}>Total Order 40</Text>}
      {/* Card Item */}
      <ScrollView>
        {/* for user message box */}
        {
          !employee && userOrder.map((Order, index) => {
            return (
              <View key={index} style={{ paddingBottom: 10, margin: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
                <Pressable onPress={()=>setFoodToLocal(Order.food_id)} style={{width:"40%"}}>
                <Image style={{ height: 130, width: "100%", resizeMode: "contain", borderRadius: 5 }} source={{ uri: Order.foodimg.length > 0 ? Order.foodimg : "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                </Pressable>
                <View style={{ width: "60%", paddingHorizontal: 15 }}>
                  {/* <Text style={{color:"white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: "#f0806c" }}>red</Text> */}
                  {!Order.rejected && <Text style={{ color: "white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: `${Order.placed ? "#77eb54" : "#f0806c"}` }}>{Order.placed ? "prepared" : "preparing"}</Text>}
                  {Order.rejected && <Text style={{ color: "white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: "#ede43e" }}>Rejected</Text>}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{Order.date.toString().substring(0, 10)}</Text>
                    <View style={{ flexDirection: "row" }}>

                      {Order.QRvalid && <TouchableOpacity onPress={() => setQrUrl(Order.QRurl)}>
                        <IoIcon style={{ marginRight: 5 }} name="qr-code" size={22} color="grey" />
                      </TouchableOpacity>}

                      {Order.placed && <TouchableOpacity onPress={() => !Order.rated && ratingModal(Order.food_id, Order.uniqueOrderId)}>
                        <IoIcon name={Order.rated ? "star" : "star-outline"} size={22} color={Order.rated ? "orange" : "grey"} />
                      </TouchableOpacity>}

                      {Order.rejected && <TouchableOpacity onPress={() => orderDeleted(Order, index)}>
                        <IoIcon name="trash" size={22} color="grey" />
                      </TouchableOpacity>}

                      {Order.placed && !Order.QRvalid && <TouchableOpacity onPress={() => orderDeleted(Order, index)}>
                        <IoIcon name="trash" size={22} color="grey" />
                      </TouchableOpacity>}
                    </View>
                  </View>
                  <View >
                    <Text style={{ fontSize: 20, fontWeight: "500", marginTop: 5 }}>{capitalizeEachWord(Order.foodname)} :: ₹{Order.foodprice}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Total : {Order.foodprice}X{Order.foodQuantity}=₹{Order.foodprice * Order.foodQuantity}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>orderId : {Order.order_id}</Text>
                  </View>
                </View>
              </View>
            )
          })
        }

        {/* for employee message box */}
        {
          employee && employeeOrder.map((Order, index) => {
            return (
              <>
                {(uniqueEmployeeId === Order.take.takenByMe ||
                  Order.take.notTaken) && <View key={index} style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
                    <Pressable onPress={()=>setFoodToLocal(Order.food_id)} style={{width:"40%"}}>
                    <Image style={{ height: 130, width: "100%", resizeMode: "contain", borderRadius: 5 }} source={{ uri: Order.foodimg.length > 0 ? Order.foodimg : "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                    </Pressable>
                    <View style={{ height: 130, width: "60%", paddingHorizontal: 15 }}>
                      <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Name : {capitalizeEachWord(Order.foodname)}</Text>
                      <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Qnty : {Order.foodQuantity}</Text>
                      <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Price : ₹{Order.foodprice}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 10 }}>
                        {Order.take.notTaken && <TouchableOpacity onPress={() => takeOrder(Order, uniqueEmployeeId, index)} style={{ height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 20 }} >
                          <Text style={{ fontWeight: 500, color: "white" }}>Take</Text>
                        </TouchableOpacity>}

                        {!Order.take.notTaken && <TouchableOpacity onPress={() => { upDateOrder(Order, index) }} style={{ height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "#4adb40", borderRadius: 20 }} >
                          <Text style={{ fontWeight: 500, color: "white" }}>Complete</Text>
                        </TouchableOpacity>}

                        {!Order.take.notTaken && <TouchableOpacity onPress={() => rejectOrder(Order, index)} style={{ height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "#ff2f00", borderRadius: 20 }} >
                          <Text style={{ fontWeight: 500, color: "white" }}>Reject</Text>
                        </TouchableOpacity>}

                      </View>
                    </View>
                  </View>
                }
              </>
            )
          })
        }
      </ScrollView>
    </SafeAreaView>
  )
}