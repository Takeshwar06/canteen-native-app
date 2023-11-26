import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Text, Image, StatusBar, ActivityIndicator } from 'react-native';

const FrontScreen = () => {

    return (
        <ImageBackground style={{ display: "flex", alignItems: "center", backgroundColor: "white", height: "100%" }} source={require("../images/food.jpg")} >
            {/* <StatusBar backgroundColor={"#000"} /> */}
            <View style={{
                width: 600, height: 600, backgroundColor: "orange",
                borderRadius: 270, borderWidth: 10, borderColor: "white",
                position: "absolute", top: -450,
            }}>
            </View>
            <View style={{
                height: 200, width: 200, backgroundColor: "red",
                borderRadius: 150, marginTop: 30, backgroundColor: "white",
                overflow: "hidden", padding: 10
            }}>
                <View style={{ backgroundColor: "orange", borderRadius: 150 }}>
                    <Image style={{ width: "100%", height: "100%", resizeMode: "stretch", marginLeft: -13 }} source={require('../images/chef.png')} />
                </View>
            </View>
            <Text style={{
                fontSize: 35, fontWeight: "bold",borderBottomColor:"white",borderBottomWidth:2,
                fontFamily: "cursive", color: "white", marginBottom: 20
            }}>*Smart Canteen*</Text>
            <View style={{
                width: "100%", flexDirection: "row", flexWrap: "wrap", justifyContent: "center",
                backgroundColor: "orange", borderRadius: 50, paddingVertical: 10,
                borderWidth: 5, borderColor: "white"
            }}>
                <View style={{
                    backgroundColor: "red", width: "46%", height: 160,
                    borderTopLeftRadius: 50,
                    margin: 5,
                    borderWidth: 10, borderColor: "white", overflow: 'hidden',
                }}>
                    <Image style={{ width: "100%", height: "100%" }} source={require("../images/food2.jpg")} />
                </View>
                <View style={{
                    backgroundColor: "red", width: "46%", height: 160,
                    borderTopRightRadius: 50,
                    margin: 5,
                    borderWidth: 10, borderColor: "white", overflow: 'hidden',
                }}>
                    <Image style={{ width: "100%", height: "100%" }} source={require("../images/food3.jpg")} />
                </View>
                <View style={{
                    backgroundColor: "red", width: "46%", height: 160,
                    borderBottomLeftRadius: 50,
                    margin: 5,
                    borderWidth: 10, borderColor: "white", overflow: 'hidden',
                }}>
                    <Image style={{ width: "100%", height: "100%" }} source={require("../images/food4.jpg")} />
                </View>
                <View style={{
                    backgroundColor: "red", width: "46%", height: 160,
                    borderBottomRightRadius: 50,
                    margin: 5,
                    borderWidth: 10, borderColor: "white", overflow: 'hidden',
                }}>
                    <Image style={{ width: "100%", height: "100%" }} source={require("../images/food.jpg")} />
                </View>




            </View>
        </ImageBackground>
    );
};

export default FrontScreen;
