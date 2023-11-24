import { View, Text } from 'react-native'
import React from 'react'
import WrapApp from './screens/WrapApp'
import FoodState from './components/context/foods/FoodState'

export default function App() {
  return (
     <FoodState>
       <WrapApp/>
     </FoodState>
  )
}