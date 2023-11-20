import { View, Text,Pressable ,Image,TouchableOpacity} from 'react-native'

export default function HomeItem({food,addToCard}) {
  return (
    <Pressable style={{ marginBottom:15,width: "50%", paddingHorizontal: 10 }}>
            <Image style={{ height: 130, width: "100%", resizeMode: "contain", borderRadius:5}} source={{ uri: food.foodimg.length>0?food.foodimg:"https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
            <View style={{marginVertical:5, flexDirection: "row", justifyContent: "space-around" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>{food.foodname}</Text>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>₹{food.foodprice}</Text>
            </View>
            <TouchableOpacity onPress={()=>addToCard(food)} style={{ borderRadius: 7, height: 30, alignItems: "center", justifyContent: "center", backgroundColor: 'orange' }}>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>Add to Card</Text>
            </TouchableOpacity>
          </Pressable>
  )
}