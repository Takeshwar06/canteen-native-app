import { View, Text, Image, TextInput, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo';
import React from 'react'
import UserMsgItem from '../components/UserMsgItem';
import EmployeeMsgItme from '../components/EmployeeMsgItme';

export default function Message() {
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >
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
      {/* for user */}
      {/* <Text style={{
        fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
      }}>Please Order your Food</Text> */}

      {/* for Employee */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 5, marginHorizontal: 10, }}>Total Order 40</Text>
      {/* Card Item */}
      <ScrollView>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
        <EmployeeMsgItme/>
      </ScrollView>
    </SafeAreaView>
  )
}