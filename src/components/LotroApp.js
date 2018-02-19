import React, { Component } from 'react';
import './LotroApp.css';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';

import {create_store, get_store} from './../Store';


let foo = {message:'hello world'};
let store = create_store(foo);

class LotroApp extends Component {
  constructor(){
    super();
    this.state = {
      greeting: 'Lotro Character Log',
      store: null
    }
  }

  componentDidMount(){
    this.setState({
      store: get_store()
    });
  }

  render() {
    return (
      <div className="lotro-app">
        <h1>{this.state.store?this.state.store.state.message:this.state.greeting}</h1>
        <CharacterPanel />
        <DeedPanel />
      </div>
    );
  }

}

export default LotroApp;
