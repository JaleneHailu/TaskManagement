import React, { useState } from "react";
import "./Main.css";
import Card from "../../components/Card/Card";
import TaskTable from "../../components/TaskTable/TaskTable";
import Header from "../../components/Header/Header";
import NavigationIcons from "../../components/NavigationIcons/NavigationIcons";
import { useContext } from "react";
import { AppState } from "../../App";
import FileManager from "../../components/File";

const MainSec = () => {
  return (
    <div className="allWrapper">
      <Header />
      <Card />
      <NavigationIcons />
    </div>
  );
};

export default MainSec;
