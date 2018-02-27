import React, { Component } from 'react';
import './CharacterPanel.css';

import {List, Panel, Button, SelectObject, TextInput} from './Common';
import {RACES, CLASSES, ACTION_TYPES} from './../constants'
import {get_store} from './../Store';


const Character = props =>{
  return (
    <div className={props.selected ? 'character selected':'character'}>
      <TextInput div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-name' value={props.name} label='Name: ' onChange={props.onChange}/>
      <SelectObject div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-race' object={RACES} default={props.race} label='Race: ' onChange={props.onChange}/>
      <SelectObject div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-class' object={CLASSES} default={props.class} label='Class: ' onChange={props.onChange}/>
      <TextInput div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-level' value={props.level} label='Level: ' onChange={props.onChange}/>
      <div className='character-form-div'>
        <Button className='character-form' text='Select' onClick={props.onSelected}/>
      </div>
    </div>
  );
}

class CharacterPanel extends Component{
  constructor(props){
    super(props);
    
    this.add_character_handler = this.handle_add_character.bind(this);
  }

  componentDidMount(){
    console.log(this.props.characters)
  }

  handle_add_character(){
    console.log('button clicked...');

    //create new character object
    let character = {
      name:'',
      race:'',
      class:'',
      level: 1
    };

    let characters = this.props.characters;
    characters.push(character);

    //update global state
    get_store().issue_action(ACTION_TYPES.CHARACTER_ADDED, {characters:characters});
  }

  ///called whenever character information is changed
  handle_change(index, event){
    console.log('handle_change called', index);
    let characters = this.props.characters;
    //determine what to update
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

    get_store().issue_action(ACTION_TYPES.CHARACTER_UPDATED, {characters: characters});
  }

  //update global state with current selected character index
  selected_handler(index, event){
    get_store().issue_action(ACTION_TYPES.CHARACTER_SELECTED, {selected_character:index})
  }

  render (){
    //if no characters, there is nothing to render
    if(!this.props.characters) return('');
    
    //build character list
    let character_list = this.props.characters.map((character, i) =>{
      return (
        <Character key={i} name={character.name} race={character.race}
          class={character.class} level={character.level}
          selected={i === this.props.selected_character}
          onChange={this.handle_change.bind(this, i)}
          onSelected={this.selected_handler.bind(this, i)}/>
      );
    })

    return(
      <Panel panel_class='panel character-panel'>
        <h3 className='panel-header'>Character Panel</h3>
        <div className='character-grid'>
          <div className='character-actions'>
            <h4>Actions:</h4>
            <Button className='btn btn-primary' text='Add Character' onClick={this.add_character_handler}/>
            <Button className='btn btn-success' text='Save All'/>
            <Button className='btn btn-danger' text='Delete Selected'/>
            <Button className='btn' text='Load From File'/>
            <Button className='btn' text='Download Character'/>
          </div>
          <div className='character-area'>
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
