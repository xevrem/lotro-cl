import React, { Component } from 'react';
import './CharacterPanel.css';

import characters from '../data/characters.json';
import {List, Panel, Button} from './Common';

import {get_store} from './../Store';


const Character = props =>{
    return (
        <div className='character'>
            <p>{props.name}</p>
            <p>{props.race}</p>
            <p>{props.class}</p>
            <p>{props.level}</p>
        </div>
    );
}

class CharacterPanel extends Component{
    constructor(){
        super();
        this.state = {
            characters: characters
        }
    }

    handle_add_character(){
        console.log('buton clicked...');
        get_store().update_state({message:'Lotro Character Log'});
    }

    render (){
        let character_list = this.state.characters.map((character, i) =>{
            return (
                <Character name={character.name} race={character.race} 
                           class={character.class} level={character.level}/>
            );
        });

        return(
            <Panel panel_class='character-panel'>
                <Button button_class='add-character-button' text='Add Character' on_click={this.handle_add_character}/>
                <List list_class='character-list' list_item_class='character-list-item'>
                    {character_list}
                </List>
            </Panel>
        );
    }
}

export default CharacterPanel;