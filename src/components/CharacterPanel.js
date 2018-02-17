import React, { Component } from 'react';

import characters from '../data/characters.json';

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
            name: 'Character Panel',
            characters: characters
        }
    }

    render (){
        let character_list = this.state.characters.map((character, i) =>{
            return (
                <li key={i}>
                    <Character name={character.name} race={character.race} class={character.class} level={character.level}/>
                </li>
            );
        });

        return(
            <div className='character-panel'>
                <ul>
                    {character_list}
                </ul>
            </div>
        );
    }
}

export default CharacterPanel;