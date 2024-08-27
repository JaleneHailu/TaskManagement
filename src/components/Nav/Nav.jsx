import React from 'react'
import Header from '../Header/Header'
import NavigationIcons from '../NavigationIcons/NavigationIcons'
import "./Nav.css"

const Nav = () => {
  return (
    <>
    <Header />
    <div className='sidenav' >
    <NavigationIcons />
    </div>
    </>
  )
}

export default Nav