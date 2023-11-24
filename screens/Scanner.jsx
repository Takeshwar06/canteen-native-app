import React ,{useState,useCallback, useContext, useEffect} from 'react'
import {
  StyleSheet,
  Text,View,Modal,Image,
  TouchableOpacity,
} from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { expireQr, getOrderThroughQr } from '../utils/APIRoutes';
import foodContext from '../components/context/foods/foodContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Scanner() {
  const [toggleScanner,setToggleScanner]=useState(false)
  const [result,setResult]=useState(undefined);
  const [employee,setEmployee]=useState(null)
  const {setLogOutModal,logOutModal,setLogInModal}=useContext(foodContext);
  const navigation=useNavigation();

  const fetchempid=async()=>{
    const localemp=await AsyncStorage.getItem("employee");
    if(!localemp){
      navigation.navigate("Home")
    }
    setEmployee(localemp);
  }
  useEffect(()=>{
     fetchempid();
  },[logOutModal])

  useFocusEffect(useCallback(()=>{
    console.log("useFocus scanner")
    fetchempid();
    setToggleScanner(false);
  },[]))

  const   onSuccess = async({data}) => {
    console.log("scanner called",data)
   // // setResult({foodname:"tiger",foodQuantity:5,foodprice:25,foodimg:"https://res.cloudinary.com/do3fiil0d/image/upload/v1700379115/foodimages/oefjglun3htt6rtqy7mp.jpg"})
      const order = await axios.post(getOrderThroughQr,{qrId:data})
      console.log(order.data[0]);
      if(order.data.length>0){
        setResult(order.data[0]);
      }else{
        alert("invalid QR code");
      }
  }
  return (
   <>
    {/* Modal section */}
    {result&&<View style={{
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
    }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={result?true:false}
        onRequestClose={() => {
          // Handle modal close
          setResult(undefined);
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
            width: "80%",
            borderWidth:1.5,
            borderColor:"orange",
            borderRadius: 20,
            padding: 15,
            alignItems: 'center',
          }}>
            <Image style={{height:180,width:250,resizeMode:"stretch", borderRadius:8}} source={{ uri:result.foodimg.length>0?result.foodimg:"https://res.cloudinary.com/do3fiil0d/image/upload/v1700379115/foodimages/oefjglun3htt6rtqy7mp.jpg" }} />
            <View style={{width:250,marginVertical:10,marginLeft:15}}>
               <Text style={{fontSize:23,fontWeight:500,marginVertical:5}}>Name : {result.foodname}</Text>
               <Text style={{fontSize:23,fontWeight:500,marginVertical:5}}>Quantity : {result.foodQuantity}</Text>
               <Text style={{fontSize:23,fontWeight:500,marginVertical:5}}>Price : ₹{result.foodprice}</Text>
               
            </View>
            <View style={{width:250,flexDirection:"row",justifyContent:"space-between"}}>
               <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={()=>setResult(undefined)}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={async()=>{
                const data=  await axios.post(`${expireQr}/${result.uniqueOrderId}`);
                setResult(undefined);
                }}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Confirm</Text>
              </TouchableOpacity>
               </View>
            </View>
        </View>
      </Modal>
    </View>}

   {toggleScanner&&
     <QRCodeScanner
     onRead={onSuccess}
     flashMode={RNCamera.Constants.FlashMode.off}
     reactivate={true}
     reactivateTimeout={700}
     showMarker={true}
     topContent={
       <Text style={styles.centerText}>
         Go to{' '}
         <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
         your computer and scan the QR code.
       </Text>
     }
     cameraStyle={{height:"100%",width:"100%"}}
     bottomContent={
       <TouchableOpacity style={styles.buttonTouchable}>
         <Text style={styles.buttonText}>OK. Got it!</Text>
       </TouchableOpacity>
     }
   />
   }
{!toggleScanner&&<View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"grey"}}>
  <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 60,
                width: 150,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={()=>setToggleScanner(true)} >
                <Text style={{ fontSize: 20, fontWeight: 700 }}>Open Scanner</Text>
              </TouchableOpacity>
  </View>}
   </>
  )
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});