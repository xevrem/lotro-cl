import React, { Component } from 'react';
import './CharacterPanel.css';

import characters from '../data/characters.json';
import {List, Panel, Button, SelectObject, TextInput} from './Common';
import {RACES, CLASSES, ACTION_TYPES} from './../constants'
import {get_store} from './../Store';


const Character = props =>{
    return (
        <div className='character col'>
            <TextInput className='form-control col-sm-9' label_class='col-form-label col-sm-3' 
                name='character-name' value={props.name} label='Name: '/>
            <SelectObject className='form-control col-sm-9' label_class='col-form-label col-sm-3' 
                select_name='race-selector' object={RACES} default={props.race} label='Race: ' />
            <SelectObject className='form-control col-sm-9' label_class='col-form-label col-sm-3' 
                select_name='class-selector' object={CLASSES} default={props.class} label='Class: ' />
            <TextInput className='form-control col-sm-9' label_class='col-form-label col-sm-3' 
                name='character-level' value={props.level} label='Level: ' />
            <div className='form-inline'>
                <Button className='form-control col btn btn-primary' text='Select'/>
            </div>
        </div>
    );
}

class CharacterPanel extends Component{
    constructor(){
        super();
        this.state = {
            characters: characters,
        }
    }

    componentDidMount(){
        console.log(this.state.characters)
    }

    handle_add_character(){
        console.log('buton clicked...');

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

    render (){
        let character_list = this.state.characters.map((character, i) =>{
            return (
                <Character key={i} name={character.name} race={character.race} 
                           class={character.class} level={character.level}/>
            );
        });

        return(
            <Panel panel_class='container panel character-panel'>
                <h3>Character Panel</h3>
                <div className='row'>
                    <div className='col-3'>
                        <h3>Characters:</h3>
                        <Button className='btn btn-primary' text='Add Character' on_click={this.handle_add_character.bind(this)}/>
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