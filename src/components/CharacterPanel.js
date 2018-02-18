import React, { Component } from 'react';
import './CharacterPanel.css';

import characters from '../data/characters.json';
import List from './Common';



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

    render (){
        let character_list = this.state.characters.map((character, i) =>{
            return (
                <Character name={character.name} race={character.race} 
                           class={character.class} level={character.level}/>
            );
        });

        return(
            <div className='character-panel'>
                <List list_class='character-list' list_item_class='character-list-item'>
                    {character_list}
                </List>
            </div>
        );
    }
}

export default CharacterPanel;