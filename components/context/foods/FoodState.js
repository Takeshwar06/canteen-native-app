import React from 'react'
import { useState } from 'react'
import foodContext from './foodContext'
import axios from 'axios';
import { addorder,
 EmployeeId, 
 getAllFoodsRoute,
 getkey,
 host,
 ordergenerate,
 paymentVarification,
 } from '../../../utils/APIRoutes';
import { useNavigation } from '@react-navigation/native';

// import { useNavigate } from 'react-router-dom';
export default function FoodState(props) {
  // const navigate=useNavigate();
  const [logOutModal, setLogOutModal] = useState(false);
  const [logInModal, setLogInModal] = useState(false);
  const [reviewPageModal,setReviewPageModal]=useState(false);
 
  return (
       <foodContext.Provider value={{
        logOutModal,setLogOutModal,
        logInModal,setLogInModal,
        reviewPageModal,setReviewPageModal,
       }}>
           {props.children}
       </foodContext.Provider>
  )
}
