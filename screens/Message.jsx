import { View, Text, Image,Modal, TextInput, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import IoIcon from 'react-native-vector-icons/Ionicons';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import { addCoin, expireQr,addorder, getAllOrderForEmployee, getCoin, host, updateCoin, updateOrder, updateReject, updateTake, EmployeeId, getAllOrderForUser, updateDeleted} from '../utils/APIRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import axios from 'axios';
import foodContext from '../components/context/foods/foodContext';

export default function Message() {
  const socket=useRef();
  const [userOrder,setUserOrder]=useState([]);
  const [employeeOrder,setEmployeeOrder]=useState([]);
  const [refreshAfterAddFood,setRefreshAfterAddFood]=useState(null);// not imp
  const [UserId,setUserId]=useState(null);
  const [employee,setEmployee]=useState(null);
  const [uniqueEmployeeId,setUniqueEmployeeId]=useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const {setLogOutModal,logInModal,logOutModal,setLogInModal}=useContext(foodContext);

  // socket connect when  user enter this screep
  const fetchempid=async()=>{
    const localemp=await AsyncStorage.getItem("employee");
    setEmployee(localemp);
  }
  useEffect(()=>{
     fetchempid();
  },[logOutModal,logInModal])
  useFocusEffect(useCallback(()=>{
    fetchUserData();
    if(socket.current){
      socket.current.on("rejected-order",data=>{
        console.log("rejected called")
      })
    }
    initailizeSocket();
    sendOrderToSocket();
},[]))

  const initailizeSocket = async()=>{
    console.log("socket")
    const userid=await AsyncStorage.getItem("UserId");
    setUserId(userid);
    const isemployee=await AsyncStorage.getItem("employee")
    setEmployee(isemployee);
    console.log("isemployee",isemployee)
    socket.current=io(host)
    socket.current.emit("add-user",userid)
    if(isemployee){
      console.log("hello")
      const uniqueEmployee=await AsyncStorage.getItem("uniqueEmployeeId")
      setUniqueEmployeeId(uniqueEmployee)
      socket.current.emit("add-employee",uniqueEmployee);
      fetchEmployeeData();
    }
  }
  // sending order to socket
  const sendOrderToSocket = async()=>{
    console.log("sendOrdertoSocket")
    const referenceNum=await AsyncStorage.getItem("referenceNum");
    if(referenceNum){
      const cardFoods=JSON.parse(await AsyncStorage.getItem("cardFoods"));
      console.log("cardfoods",cardFoods);
      if(cardFoods){
        socket.current.emit("send-order",{
          cardFoods,referenceNum
      })
         console.log("cardFoods avalablel in local")
          addOrder(cardFoods,referenceNum);
          fetchUserData();
          await AsyncStorage.removeItem("cardFoods")
      }
      console.log("after add order")
      
      }
  }
  // addOrder to data-base
  const addOrder=async(cardFoods,order_id)=>{
    console.log("addorder called")
    cardFoods.forEach(async(food) => {
      const response= await axios.post(addorder,{ 
        uniqueOrderId:food.uniqueOrderId,
        foodname:food.foodname,
        UserId:food.UserId,
        EmployeeId:food.EmployeeId,
        foodQuantity:food.foodQuantity,
        foodprice:food.foodprice,
        foodimg:food.foodimg,
        placed:false,
        order_id:order_id
       })
       if(response){
         setRefreshAfterAddFood(order_id);
       }
    });  
}

// delet order by user
const orderDeleted=async(Order,index)=>{
  const data=[...userOrder]
  data.splice(index,1);
  setUserOrder(data);
  let response =await axios.post(`${updateDeleted}/${Order.uniqueOrderId}`,{deleted:true})
 //  fetchdata();
}

  // fetching user data 
  const  fetchUserData = async()=>{
    console.log("fetchUserData called")
    const userid=await AsyncStorage.getItem("UserId")
    let response=  await axios.post(getAllOrderForUser,{
       UserId:userid,
       EmployeeId:EmployeeId
      })
     setUserOrder(response.data);
    }
  // when rejected order by employee
  useEffect(()=>{
    if(socket.current){
      socket.current.on("rejected-order",(data)=>{
        console.log("rejected-orderr called")
        const tempUserOrder=[...userOrder]
       userOrder.forEach((element,index)=>{
         if(element.uniqueOrderId==data.uniqueOrderId){
          tempUserOrder[index].rejected=true;
          tempUserOrder[index].QRvalid=false;
          setUserOrder(tempUserOrder);
         }
       })   
        // console.log("rejected order",data);
      })
    }
},[employeeOrder,rejectOrder])

// after completed order
useEffect(()=>{
  if(socket.current){
   socket.current.on("completed-order",(data)=>{
    console.log("completed-order called");
    const tempUserOrder=[...userOrder]
    userOrder.forEach((element,index)=>{
      if(element.uniqueOrderId==data.uniqueOrderId){
       tempUserOrder[index].placed=true;
       setUserOrder(tempUserOrder);
      }
    })
    // fetchdata();    // to do

   })
  }
},[])


  // now this part for employee *****************||***************
  const fetchEmployeeData = async()=>{
    const response = await axios.post(getAllOrderForEmployee)
     setEmployeeOrder(response.data);
  }
  // clicking coplete Order
  const upDateOrder = async (order,index) => {
    console.log(order);
    const data=[...employeeOrder];
    data.splice(index,1);
    const response=await axios.post(`${updateOrder}/${order.uniqueOrderId}`, { placed: true })
      socket.current.emit("complete-order",order); 
      setEmployeeOrder(data);
      // empfetchdata();
  }
  // cliking reject Order
  const rejectOrder=async(order,index)=>{
    console.log(order);
    await axios.post(`${updateReject}/${order.uniqueOrderId}`,{rejected:true})
    await axios.post(`${expireQr}/${order.uniqueOrderId}`)
      const data=[...employeeOrder];
      data.splice(index,1);
      setEmployeeOrder(data);
      socket.current.emit("reject-order",order);

    const presentUser=await axios.post(getCoin,{userId:order.auth[0]})
    if(presentUser.data.length>0){ 
       // updateCoin
       const response=await axios.post(updateCoin,{ 
        userId:presentUser.data[0].userId,
        updatedCoin:presentUser.data[0].coin+(order.foodprice*order.foodQuantity)
       })
    }
    else{
      //  addCoin
      const response=await axios.post(addCoin,{userId:order.auth[0],coin:order.foodprice})
    }
  }
  // when taking order by employye
  const takeOrder = async (order,employeeId,index) => { 
    console.log("empid",order); //

    if(employeeId){
   const response=await axios.post(`${updateTake}/${order.uniqueOrderId}`, { take:{
      notTaken:false, 
      takenByMe:employeeId
    } })
     console.log(response)
      socket.current.emit("take-order",{order,employeeId,index});
      const data=[...employeeOrder];
      data[index].take.notTaken=false;
      data[index].take.takenByMe=employeeId;
      setEmployeeOrder(data);
    
    }
  }

  // after taking order by another
  useEffect(()=>{
    if(socket.current){
     socket.current.on("took-order",({order,employeeId,index})=>{
       console.log("taked order by another emp",employeeId);
     let data=[...employeeOrder];
     console.log(data);
     if(data.length>0){  // &&data[index]._id===order._id
         order.take.notTaken=false;
         order.take.takenByMe=employeeId;
         data[index]=order
         console.log("data[index]",data[index])
         setEmployeeOrder(data);  // dynamically generated order card not take due to order._id 
     }
 
     })
    }
 },[takeOrder])

  // when receving order from user
  useEffect(()=>{
    if(socket.current){
      console.log("socket.current called")
        socket.current.on("recieve-order",(data)=>{
          let temp2=[] // data=[...orders]
          data.cardFoods.forEach((food)=>{
            let tempOrder={
              take:{notTaken:true,takenByMe:null},
              rejected:false,
              deleted:false,
              auth:[food.UserId,food.EmployeeId],
              foodQuantity:food.foodQuantity,
              foodimg:food.foodimg,
              foodname:food.foodname,
              foodprice:food.foodprice,
              order_id:data.referenceNum,
              uniqueOrderId:food.uniqueOrderId   
             }
             console.log("orderslll",tempOrder.order_id);
            if(employeeOrder.length===1){  // using orders.length>0 concept
            //   // setOrders([...orders,tempOrder])    
            console.log("page refresh")
              fetchEmployeeData();
            }
        
           temp2.push(tempOrder);
          })
          let temp1=[...employeeOrder]
          let mergedArray=temp1.concat(temp2)
          setEmployeeOrder(mergedArray)
          // }
      })
     }
  
  },[employeeOrder])

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
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >

          {/* modal section */}
    {!employee&&<View style={{
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={qrUrl?true:false}
        onRequestClose={() => {
          // Handle modal close
          setQrUrl(null);
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
            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'flex-end',}} >
              <TouchableOpacity onPress={()=>setQrUrl(null)}>
                <IoIcon name="close-circle-outline" size={30} ></IoIcon>
              </TouchableOpacity>
            </View>
            <View style={{height:300,width:300,marginBottom:25,flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <Image style={{ height:300,width:300 }} source={{ uri:qrUrl?qrUrl:"tiger.jpg" }} />
            <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={()=>setQrUrl(null)}>
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
        {employee&&<TouchableOpacity onPress={()=>setLogOutModal(true)}>
          <IoIcon style={{ paddingLeft: 0 }} name="power" size={28} color="#000" />
        </TouchableOpacity>}

        {!employee&&<TouchableOpacity onPress={()=>setLogInModal(true)}>
          <IoIcon style={{ paddingLeft: 0 }} name="person-circle-outline" size={30} color="#000" />
        </TouchableOpacity>}
      </View>
      {/* for user */}
      {!employee&& <Text style={{
        fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
      }}>Please Order your Food</Text> }

      {/* for Employee */}
      {employee&&<Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 5, marginHorizontal: 10, }}>Total Order 40</Text>}
      {/* Card Item */}
      <ScrollView>
      {/* for user message box */}
      {
        !employee&&userOrder.map((Order,index)=>{
          return(
            <View key={index} style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
            <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius: 5 }} source={{ uri:Order.foodimg.length>0?Order.foodimg: "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
            <View style={{ height: 130, width: "60%", paddingHorizontal: 15 }}>
                {/* <Text style={{color:"white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: "#f0806c" }}>red</Text> */}
                {!Order.rejected&& <Text style={{color:"white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: `${Order.placed?"#77eb54":"#f0806c"}` }}>{Order.placed?"prepared":"preparing"}</Text> }
                {Order.rejected&& <Text style={{color:"white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: "#ede43e" }}>Rejected</Text>}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{Order.date.toString().substring(0,10)}</Text>
                    <View style={{ flexDirection: "row" }}>

                        {Order.QRvalid&&<TouchableOpacity onPress={()=>setQrUrl(Order.QRurl)}>
                        <IoIcon style={{ marginRight: 5 }} name="qr-code" size={22} color="grey" />
                        </TouchableOpacity>}

                        {Order.rejected&&<TouchableOpacity onPress={()=>orderDeleted(Order,index)}>
                        <IoIcon name="trash" size={22} color="grey" />
                        </TouchableOpacity>}

                       {Order.placed&& <TouchableOpacity  onPress={()=>orderDeleted(Order,index)}>
                        <IoIcon name="trash" size={22} color="grey" />
                        </TouchableOpacity>}
                    </View>
                </View>
                <View >
                    <Text style={{ fontSize: 20, fontWeight: "500", marginTop: 5 }}>{capitalizeEachWord(Order.foodname)} :: ₹{Order.foodprice}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Total : {Order.foodprice}X{Order.foodQuantity}=₹{Order.foodprice*Order.foodQuantity}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>orderId : {Order.referenceNum}</Text>
                </View>
            </View>
        </View>
          )
        })
      }

      {/* for employee message box */}
      {
        employee&&employeeOrder.map((Order,index)=>{
          // console.log("checking take undefined",Order)
          return(
           <>
              {(uniqueEmployeeId===Order.take.takenByMe||
                 Order.take.notTaken)&& <View key={index} style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
                 <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius: 5 }} source={{ uri:Order.foodimg.length>0?Order.foodimg: "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                 <View style={{ height: 130, width: "60%", paddingHorizontal: 15 }}>
                   <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Name : {capitalizeEachWord(Order.foodname)}</Text>
                   <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Qnty : {Order.foodQuantity}</Text>
                   <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Price : ₹{Order.foodprice}</Text>
                   <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 10 }}>
                     {Order.take.notTaken&&<TouchableOpacity onPress={()=>takeOrder(Order,uniqueEmployeeId,index)} style={{height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 3 }} >
                       <Text style={{ fontWeight: "bold" }}>Take</Text>
                     </TouchableOpacity>}
           
                     {!Order.take.notTaken&&<TouchableOpacity onPress={() => { upDateOrder(Order,index) }} style={{ height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 3 }} >
                       <Text style={{ fontWeight: "bold" }}>Complete</Text>
                     </TouchableOpacity>}
     
                     {!Order.take.notTaken&&<TouchableOpacity onPress={()=>rejectOrder(Order,index)} style={{ height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 3 }} >
                       <Text style={{ fontWeight: "bold" }}>Reject</Text>
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