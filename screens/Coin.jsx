// import React, { useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

// const Coin = () => {
//   const [alertVisible, setAlertVisible] = useState(false);
//   const translateY = useRef(new Animated.Value(-100)).current;

//   const showAlert = () => {
//     setAlertVisible(true);

//     // Slide down animation
//     Animated.timing(translateY, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();

//     // Hide the alert after a certain duration
//     setTimeout(() => {
//       hideAlert();
//     }, 1500); // Adjust as needed
//   };

//   const hideAlert = () => {
//     // Slide up animation
//     Animated.timing(translateY, {
//       toValue: -100,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setAlertVisible(false);
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={showAlert} style={styles.button}>
//         <Text style={styles.buttonText}>Show Custom Alert</Text>
//       </TouchableOpacity>

//       {alertVisible && (
//         <Animated.View style={[styles.alert, { transform: [{ translateY }] }]}>
//           <Text style={styles.alertText}>Success! Your action was successful.</Text>
//         </Animated.View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     backgroundColor: 'blue',
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: 'white',
//   },
//   alert: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'green',
//     padding: 10,
//   },
//   alertText: {
//     color: 'white',
//   },
// });

// export default Coin;




import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Coin = () => {
  const [currentAlert, setCurrentAlert] = useState(null);

  const showAlert = (message) => {
    // Update the current alert
    setCurrentAlert(message);

    // Clear the alert after a certain duration (e.g., 2000 milliseconds)
    setTimeout(() => {
      hideAlert();
    }, 2000);
  };

  const hideAlert = () => {
    // Clear the current alert
    setCurrentAlert(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => showAlert('This is a new alert!')} style={styles.button}>
        <Text style={styles.buttonText}>Show Alert</Text>
      </TouchableOpacity>

      {currentAlert && (
        <View style={{position: 'absolute',top: 0,left: 0,right: 0,backgroundColor: 'green',padding: 10,}}>
          <Text style={{color: 'white',}}>{currentAlert}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  alert: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'green',
    padding: 10,
  },
  alertText: {
    color: 'white',
  },
});

export default Coin;
