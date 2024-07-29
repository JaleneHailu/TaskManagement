import React, { useState } from 'react';
import './Main.css';
import './main';
import Header from '../Header/Header';
import Card from '../Card/Card';
import NavigationIcons from '../NavigationIcons/NavigationIcons';
import TaskTable from '../TaskTable/TaskTable';

const MainSec = () => {

    return (
        <div className="allWrapper">
            <Header />
            <Card />
            <NavigationIcons />
            <TaskTable />
        </div>
    );
}

export default MainSec;
