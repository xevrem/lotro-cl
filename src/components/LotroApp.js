import React, { Component } from 'react';
import './LotroApp.css';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';

class LotroApp extends Component {
  constructor(){
    super();
    this.state = {
      greeting: 'Lotro Character Log'
    }
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
