import React, { Component } from 'react';
import './LotroApp.css';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';
import SummaryPanel from './SummaryPanel';

import {create_store, get_store} from './../Store';
import {ACTION_TYPES} from './../constants';


let foo = {selected_character:0};
create_store(foo);

class LotroApp extends Component {
  constructor(){
    super();
    this.state = {
      greeting: 'Lotro Character Log',
      store: null,
      selected_character: 0
    }
  }

  componentDidMount(){
    get_store().subscribe(ACTION_TYPES.CHARACTER_SELECTED, this.handle_character_selected.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_SELECTED, this.handle_deed_selected.bind(this));
  }

  handle_character_selected(store){

    console.log('handle_character_selected called...', store.selected_character);
    this.setState({
      selected_character: store.selected_character
    })
  }

  handle_deed_selected(store){
    console.log('handle_deed_selected called...', store.selected_deed);
    this.setState({
      selected_deed: store.selected_deed
    })
  }

  render() {
    return (
      <div className="lotro-app">
        <h1 className='page-title'>{this.state.greeting}</h1>
        <CharacterPanel selected_character={this.state.selected_character}/>
        <SummaryPanel />
        <DeedPanel selected_deed={this.state.selected_deed}/>
      </div>
    );
  }

}

export default LotroApp;
