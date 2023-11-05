import { View, Text, Image, TextInput, StyleSheet, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo';
import React from 'react'

export default function UserMsgItem() {
    return (
        <View style={{ height: 150, paddingBottom: 10, margin: 10, flexDirection: "row", borderWidth: 1, borderBlockColor: "black", borderTopWidth: 0, borderLeftWidth: 0, borderRightWidth: 0 }}>
            <Image style={{ height: 130, width: "40%", resizeMode: "contain", borderRadius: 5 }} source={{ uri: "https://www.verywellhealth.com/thmb/f1Ilvp8yoFZEKP_B_YBK8HO1irE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gastritis-diet-what-to-eat-for-better-management-4767967-primary-recirc-fc776855e98b43b9832a6fd313097d4f.jpg" }} />
            <View style={{ height: 130, width: "60%", paddingHorizontal: 15 }}>
                <Text style={{color:"white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: "#f0806c" }}>Rejected</Text>
                {/* <Text style={{color:"white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: "#77eb54" }}>Rejected</Text> */}
                {/* <Text style={{color:"white", textAlign: "center", borderRadius: 4, fontWeight: "bold", backgroundColor: "#ede43e" }}>Rejected</Text> */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>12-12-23</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Icon style={{ marginRight: 5 }} name="home" size={22} color="grey" />
                        <Icon name="home" size={22} color="grey" />
                    </View>
                </View>
                <View >
                    <Text style={{ fontSize: 20, fontWeight: "500", marginTop: 5 }}>Samosa :: 20Rs</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>Total : 20X3=139Rs</Text>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginTop: 5 }}>orderId : Id_54825fhfj_ff</Text>
                </View>
            </View>
        </View>
    )
}