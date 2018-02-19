import React, { Component } from 'react';
import './LotroApp.css';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';

import {create_store, get_store} from './../Store';


let foo = {message:'hello world'};
create_store(foo);

class LotroApp extends Component {
  constructor(){
    super();
    this.state = {
      greeting: 'Lotro Character Log',
      store: null
    }
  }

  componentDidMount(){
    let message_handler = this.handle_message_update.bind(this);
    get_store().subscribe('message', message_handler);
  }

  handle_message_update(state, action){
    console.log('handler called')
    this.setState({
      greeting: state.message
    })
  }

  render() {
    return (
      <div className="lotro-app">
        <h1>{this.state.greeting}</h1>
        <CharacterPanel />
        <DeedPanel />
      </div>
    );
  }

}

export default LotroApp;
