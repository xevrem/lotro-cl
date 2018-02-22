import React, { Component } from 'react';
import './CharacterPanel.css';

import characters from '../data/characters.json';

import {List, Panel, Button, SelectObject, TextInput} from './Common';
import {RACES, CLASSES, ACTION_TYPES} from './../constants'
import {get_store} from './../Store';


const Character = props =>{
  return (
    <div className={props.selected ? 'character col selected':'character col'}>
      <TextInput className='form-control col-sm-9' label_class='col-form-label col-sm-3'
        name='character-name' value={props.name} label='Name: ' onChange={props.onChange}/>
      <SelectObject className='form-control col-sm-9' label_class='col-form-label col-sm-3'
        name='character-race' object={RACES} default={props.race} label='Race: ' onChange={props.onChange}/>
      <SelectObject className='form-control col-sm-9' label_class='col-form-label col-sm-3'
        name='character-class' object={CLASSES} default={props.class} label='Class: ' onChange={props.onChange}/>
      <TextInput className='form-control col-sm-9' label_class='col-form-label col-sm-3'
        name='character-level' value={props.level} label='Level: ' onChange={props.onChange}/>
      <div className='form-inline'>
        <Button className='form-control col btn btn-primary' text='Select' onClick={props.onSelected}/>
      </div>
    </div>
  );
}

class CharacterPanel extends Component{
  constructor(props){
    super(props);
    this.state = {
        characters: characters,
    }
    this.add_character_handler = this.handle_add_character.bind(this);
  }

  componentDidMount(){
    console.log(this.state.characters)
  }

  handle_add_character(){
    console.log('button clicked...');

    //create new character object
    let character = {
      name:'',
      race:'',
      class:'',
      level: undefined
    };

    //update local state
    this.setState((prev, props)=>{
      prev.characters.push(character)
      return{
        characters: prev.characters
      };
    });

    //update global state
    get_store().issue_action(ACTION_TYPES.CHARACTER_ADDED, {'character':character});
  }

  ///called whenever character information is changed
  handle_change(index, event){
    //console.log('change...', event.target, index)
    let characters = this.state.characters;
    switch(event.target.name){
      case 'character-name':
        characters[index].name = event.target.value
        break;
      case 'character-race':
        characters[index].race = event.target.value
        break;
      case 'character-class':
        characters[index].class = event.target.value
        break;
      case 'character-level':
        characters[index].level = event.target.value
        break;
      default:
        break;
    }

    this.setState({
      characters: characters
    });

    //FIXME: this may be an issue later, so remove if never used
    get_store().issue_action(ACTION_TYPES.CHARACTER_UPDATE, characters);
  }

  selected_handler(index, event){
    get_store().issue_action(ACTION_TYPES.CHARACTER_SELECTED, {selected_character:index})
  }

  render (){
    let character_list = this.state.characters.map((character, i) =>{
      return (
        <Character key={i} name={character.name} race={character.race}
          class={character.class} level={character.level}
          selected={i === this.props.selected_character}
          onChange={this.handle_change.bind(this, i)}
          onSelected={this.selected_handler.bind(this, i)}/>
      );
    });

    return(
      <Panel panel_class='container panel character-panel'>
        <h3>Character Panel</h3>
        <div className='row'>
          <div className='col-3'>
            <h3>Characters:</h3>
            <Button className='btn btn-primary' text='Add Character' onClick={this.add_character_handler}/>
            <Button className='btn btn-success' text='Save All'/>
            <Button className='btn btn-danger' text='Delete Selected'/>
          </div>
          <div className='col'>
            <List list_class='character-list' list_item_class='character-list-item'>
              {character_list}
            </List>
          </div>
        </div>
      </Panel>
    );
  }
}

export default CharacterPanel;
