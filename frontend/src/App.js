import React, { useState, useEffect } from "react";
import Navbar from "./NavBar/NavBar";
import { Routers } from "./Router";

import axios from 'axios';

export default function App() {
  const default_val = localStorage.getItem("authToken") === 'true' ? true : false;
  const [isAuthorised, changeIsAuthorised] = useState(default_val);
  const [filepath, changeFilepath] = useState('');

  // useEffect(() => {
  //   axios.get('/set');
  // }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Navbar isAuthorised={isAuthorised} changeIsAuthorised={changeIsAuthorised} />
      <Routers changeIsAuthorised={changeIsAuthorised} filepath={filepath} changeFilepath={changeFilepath}/>
    </div>
  )
};