import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import IoIcon from 'react-native-vector-icons/Ionicons'
const Coin = ({ logOutModal,setLogOutModal,logInModal,setlogInModal}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <TouchableOpacity onPress={toggleModal}>
        <Text style={styles.openButton}>Open Modal</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Handle modal close
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            margin: 20,
            backgroundColor: 'white',
            width: "100%",
            borderRadius: 20,
            padding: 15,
            alignItems: 'center',
          }}>
            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'flex-end', marginBottom: 30 }} >
              <TouchableOpacity onPress={toggleModal}>
                <IoIcon name="close-circle-outline" size={30}></IoIcon>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 500, marginBottom: 30 }}>Please select and option to payments</Text>

            <View style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 25,
            }}>
              <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={toggleModal}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Coin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: "orange",
                height: 40,
                width: 80,
                borderRadius: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }} onPress={toggleModal}>
                <Text style={{ fontSize: 17, fontWeight: 500 }}>Rupees</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  openButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    color: 'white',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    color: 'white',
  },
});

export default Coin;
