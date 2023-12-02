import { View, Text, ActivityIndicator} from 'react-native'
import React from 'react'

export default function DefaultHome() {
  return (
    <View>
        {/* circle */}
      <View style={{flexDirection:"row"}}>
     <View style={{margin:7}}>
        <View style={{backgroundColor:"#ede7e6",width:70,height:70,borderRadius:70/2}}></View>
        <View style={{backgroundColor:"#ede7e6",width:70,height:17,borderRadius:2,marginTop:7}}></View>
     </View>  
     <View style={{margin:7}}>
        <View style={{backgroundColor:"#ede7e6",width:70,height:70,borderRadius:70/2}}></View>
        <View style={{backgroundColor:"#ede7e6",width:70,height:17,borderRadius:2,marginTop:7}}></View>
     </View>  
     <View style={{margin:7}}>
        <View style={{backgroundColor:"#ede7e6",width:70,height:70,borderRadius:70/2}}></View>
        <View style={{backgroundColor:"#ede7e6",width:70,height:17,borderRadius:2,marginTop:7}}></View>
     </View>  
     <View style={{margin:7}}>
        <View style={{backgroundColor:"#ede7e6",width:70,height:70,borderRadius:70/2}}></View>
        <View style={{backgroundColor:"#ede7e6",width:70,height:17,borderRadius:2,marginTop:7}}></View>
     </View>  
     <View style={{margin:7}}>
        <View style={{backgroundColor:"#ede7e6",width:70,height:70,borderRadius:70/2}}></View>
        <View style={{backgroundColor:"#ede7e6",width:70,height:17,borderRadius:2,marginTop:7}}></View>
     </View>  
      </View>
      {/* slider */}
      <View style={{flexDirection:"column",justifyContent:"flex-end",alignItems:'center', width:"100%",marginTop:17,height:200,backgroundColor:"#ede7e6"}}>
      <ActivityIndicator size="large" color="orange" />
        <View style={{width:70, height:50,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
           <View style={{backgroundColor:"white",height:12,width:12,borderRadius:12}}></View>
           <View style={{backgroundColor:"white",height:12,width:12,borderRadius:12}}></View>
           <View style={{backgroundColor:"white",height:12,width:12,borderRadius:12}}></View>
        </View>
      </View>
      {/* Text content */}
      <View style={{backgroundColor:"#ede7e6",width:"100%",height:26,borderRadius:5,marginTop:13}}></View>

      {/* boxfood */}
      <View style={{marginVertical:10,flexDirection:"row",flexWrap:"wrap"}}>
    <View style={{width:"50%",display:"flex",flexWrap:"wrap",padding:5}}>
        <View style={{width:"100%",height:130,borderRadius:15,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:16,marginTop:5,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:23,marginTop:5,borderRadius:65,backgroundColor:"#ede7e6"}}></View>
    </View>
    <View style={{width:"50%",display:"flex",flexWrap:"wrap",padding:5}}>
        <View style={{width:"100%",height:130,borderRadius:15,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:16,marginTop:5,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:23,marginTop:5,borderRadius:65,backgroundColor:"#ede7e6"}}></View>
    </View>
    <View style={{width:"50%",display:"flex",flexWrap:"wrap",padding:5}}>
        <View style={{width:"100%",height:130,borderRadius:15,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:16,marginTop:5,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:23,marginTop:5,borderRadius:65,backgroundColor:"#ede7e6"}}></View>
    </View>
    <View style={{width:"50%",display:"flex",flexWrap:"wrap",padding:5}}>
        <View style={{width:"100%",height:130,borderRadius:15,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:16,marginTop:5,backgroundColor:"#ede7e6"}}></View>
        <View style={{width:"100%",height:23,marginTop:5,borderRadius:65,backgroundColor:"#ede7e6"}}></View>
    </View>
      </View>
    </View>
  )
}