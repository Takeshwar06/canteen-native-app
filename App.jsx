import { View, Text } from 'react-native'
import React,{useState,useEffect} from 'react'
import WrapApp from './screens/WrapApp'
import FoodState from './components/context/foods/FoodState'
import FrontScreen from './components/FrontScreen'

export default function App() {
  const [showFrontScreen,setShowFrontScreen]=useState(true);

  useEffect(()=>{
    setTimeout(() => {
      setShowFrontScreen(false);
    }, 1500);
  },[])
  return (
     <FoodState>
       {showFrontScreen?<FrontScreen/>
        :<WrapApp/>} 
     </FoodState>
  )
}