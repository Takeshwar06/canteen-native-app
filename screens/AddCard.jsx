import { View, Text, TextInput, StyleSheet,SafeAreaView, Pressable, ScrollView } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo';

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
          fontSize:18,fontWeight:"bold",textAlign:'center',marginVertical:5
        }}>Please Order your Food</Text>
       
       {/* Card Item */}
       <ScrollView style={{marginBottom:30}}>
         <View style={{height:150,margin:10}}>
            
         </View>
       </ScrollView>
        <View style={styles.bottomBar}>
        <Text>Fixed at the Bottom</Text>
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
    padding: 10,
    backgroundColor:"blue"
  },
});