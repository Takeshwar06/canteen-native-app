import { View, TextInput, Image, Pressable, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Entypo';
import { SliderBox } from 'react-native-image-slider-box'
import HomeItem from '../components/HomeItem';
export default function Home() {
  const data = ["tiger", "tiger janghle", "tiger", "tiger", "tiger"]
  const images = [
    "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg",
    "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg",
    "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg",
  ]
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >
      <ScrollView>
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
            <Icon style={{ paddingLeft: 10 }} name="home" size={22} color="#000" />
            <TextInput placeholder="Search" />
          </Pressable>
          <Icon style={{ paddingLeft: 0 }} name="home" size={22} color="#000" />
        </View>
        {/*  circule Item */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {
            data.map((element, index) => {
              return (
                <Pressable key={index} style={{
                  margin: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }} >
                  <Image style={{
                    width: 70, height: 70,
                    borderRadius: 70 / 2,
                    resizeMode: "contain",
                  }} source={{ uri: "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
                  <Text style={{
                    textAlign: "center",
                    fontSize: 13,
                    fontWeight: "500",
                    marginTop: 3,
                  }} >{element}</Text>
                </Pressable>
              )
            })
          }
        </ScrollView>
        <SliderBox images={images} autoPlay circleLoop />
        <Text style={{ padding: 10, fontSize: 20, fontWeight: "bold" }} >Trending Deasl of the week</Text>
        {/* card Item */}

        <View style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          {/* Home item card */}
          <HomeItem/>
          <HomeItem/>
          <HomeItem/>
          <HomeItem/>
          <HomeItem/>
          <HomeItem/>
         
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}