import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {proxy} from './Proxy2'
import { Login } from './login'
import { Main } from './Main'; 



export default class App extends Component
{
  state = { showLogin: true };
  componentDidMount()
  {
    proxy.addEventListener( "login", () => this.setState( { showLogin: false } ) );
  }
  render()
  {
    return (
      <div className="app"> 
      { this.state.showLogin ? <Login /> : <Main /> }
      </div>
      );
    }
  }
  
  