import { View, Text, Image, TextInput, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import CardItem from '../components/CardItem';

export default function AddCard() {
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 0 : 0,
        flex: 1,
        backgroundColor: "white"
      }}
    >
      <View style={styles.container}>
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
        <Text style={{
          fontSize: 18, fontWeight: "bold", textAlign: 'center', marginVertical: 5
        }}>Please Order your Food</Text>

        {/* Card Item */}
        <ScrollView style={{ marginBottom: 100 }}>
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
        </ScrollView>
        <View style={styles.bottomBar}>
          <View style={{ borderBottomColor: "black", borderBottomWidth: 1, justifyContent: "space-between", flexDirection: "row", width: "100%" }}>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>Items</Text>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>15</Text>
          </View>
          <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", }}>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>SubTotal</Text>
            <Text style={{ marginHorizontal: 5, fontSize: 20, fontWeight: "500" }}>420Rs</Text>
          </View>
          <TouchableOpacity style={{ marginTop: 5, height: 40, backgroundColor: "orange", width: "100%", borderRadius: 8, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
});