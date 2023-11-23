import { View, Text, Image, TextInput, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'

export default function EmployeeMsgItme() {
  return (
    <View style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
      <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius: 5 }} source={{ uri: "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
      <View style={{ height: 130, width: "60%", paddingHorizontal: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Name : Samosa</Text>
        <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Qnty : 20Rs</Text>
        <Text style={{ fontSize: 18, fontWeight: "500", marginTop: 3 }}>Price : 20Rs</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 10 }}>
          <TouchableOpacity style={{ height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 3 }} >
            <Text style={{ fontWeight: "bold" }}>Confirm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ height: 30, width: 70, justifyContent: "center", alignItems: "center", backgroundColor: "orange", borderRadius: 3 }} >
            <Text style={{ fontWeight: "bold" }}>Confirm</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  )
}