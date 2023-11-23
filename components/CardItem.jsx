import { View, Text,Image, TouchableOpacity } from 'react-native'
import IoIcon from 'react-native-vector-icons/Ionicons'
import React from 'react'

export default function CardItem({food}) {

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
    <View style={{height:150,paddingBottom:10,margin:10,flexDirection:"row",borderWidth:1,borderBlockColor:"black",borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0}}>
         <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius:5}} source={{ uri: food.foodimg.length>0?food.foodimg:"https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
           <View style={{width:"60%",padding:10,justifyContent:"space-between",marginLeft:20}}>
                <Text style={{fontSize:20,fontWeight:"bold"}}>Name : {capitalizeEachWord(food.foodname)}</Text>
                <Text style={{fontSize:20,fontWeight:"bold"}}>Price : ₹{food.foodprice}</Text>
                <View style={{flexDirection:"row"}}>
                  <TouchableOpacity style={{height:30,width:30,borderRadius:30/2,backgroundColor:"orange",alignItems:"center",justifyContent:"center"}}>
                    <Text style={{color:"white",fontSize:20,fontWeight:"bold"}}>-</Text>
                  </TouchableOpacity>
                  <Text style={{fontSize:20,fontWeight:"bold",marginLeft:20}}>{food.foodQuantity}</Text>
                  <TouchableOpacity style={{height:30,width:30,borderRadius:30/2,backgroundColor:"orange",alignItems:"center",justifyContent:"center",marginLeft:20}}>
                    <Text style={{color:"white",fontSize:20,fontWeight:"bold"}}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{height:30,width:30,borderRadius:30/2,backgroundColor:"orange",alignItems:"center",justifyContent:"center",marginLeft:40}}>
                    <IoIcon name="trash" size={19} style={{color:"white"}}/>
                  </TouchableOpacity>
                </View>
            </View> 
         </View>
  )
}