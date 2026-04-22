import React from 'react'
import {BrowserRouter as Router , Route,Routes} from "react-router-dom"
import UserRegister from '../pages/UserRegister'
import UserLogin from '../pages/UserLogin'
import FoodPartnerRegister from '../pages/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/FoodPartnerLogin'
import Home from '../pages/general/Home'
import Saved from '../pages/general/Saved'
import Profile from '../pages/food-partner/Profile'
import CreateFoodPartner from '../pages/food-partner/CreateFoodPartner'

function AppRoute() {
  return (
    <Router>
        <Routes>
            <Route path = "/user/register" element={<UserRegister/>}/>
            <Route path='/user/login' element = {<UserLogin/>}/>
            <Route path='/food-partner/register' element = {<FoodPartnerRegister/>}/>
            <Route path='/food-partner/login' element = {<FoodPartnerLogin/>}/>
            <Route path='/food-partner/profile' element={<Profile/>} />
            <Route path='/food-partner/:id' element={<Profile/>} />
            <Route path='/food-partner/create-food' element={<CreateFoodPartner/>} />
            <Route path='/' element={<Home/>}/>
            <Route path='/saved' element={<Saved/>}/>
        </Routes>
    </Router>
  )
}

export default AppRoute;
