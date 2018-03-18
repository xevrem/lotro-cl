import React, { Component } from 'react';
import './DeedPanel.css';

import {DoublePanel, List, Panel, Button} from './Common';
import {ACTION_TYPES} from './../constants';

import {get_store} from './../Store';

/**
 *
 * @param {boolean} props.selected is this deed currently selected
 * @param {callback} props.onClick called when clicked
 * @param {string} props.name deed name
 * @param {JSX.Element} props.children the child elemnts contained within the deed div
 */
const Deed = ({selected, onClick, name, children}) =>{
  return(
    <div className={selected?'deed clickable selected':'deed clickable'} onClick={onClick}>
      <p className='col text-left' >{name}</p>
      {children}
    </div>
  );
}


class DeedPanel extends Component{
  constructor(props){
    super(props);
    this.deed_complete_handler = this.handle_deed_complete.bind(this);
  }

  handle_category_click(index, event){
      // console.log('nav clicked...', event.target.text);
      get_store().issue_action(ACTION_TYPES.DEED_CATEGORY_CHANGED,{deed_category_selected:index});
  }

  handle_deed_complete(deed_type, event){
    // console.log('deed complete...', this.props.selected_deed);

    //toggle the specific deed
    let update = this.props.characters[this.props.selected_character].completed;
    update[deed_type][this.props.selected_deed] = update[deed_type][this.props.selected_deed] ? false : true;

    //update the character deed completion data
    let updated_characters = this.props.characters;
    updated_characters[this.props.selected_character].completed = update;
    get_store().issue_action(ACTION_TYPES.CHARACTER_UPDATED,{characters:updated_characters});
  }

  handle_selected(index, event){
    get_store().issue_action(ACTION_TYPES.DEED_SELECTED, {selected_deed:index});
  }

  handle_subcategory_click(index, event){
    get_store().issue_action(ACTION_TYPES.DEED_SUBCATEGORY_CHANGED, {deed_subcategory_selected:index});
  }

  render(){
    //if no deeds, there is nothing to render
    if(!this.props.deeds || !this.props.deed_subcatetories || this.props.selected_character < 0 || !this.props.characters) return('');

    let character = this.props.characters[this.props.selected_character];

    //build list of deeds to display
    let deed_list = this.props.deeds.map((deed,i)=>{

      //filter non-selected subcategories
      if(deed.Subcategory != this.props.deed_subcategory_selected) return;

      //build the deed according to whether it is selected, its information, and if it is completed.
      return i === this.props.selected_deed ? (
        <Deed key={i} name={deed.Deed} selected={true} onClick={this.handle_selected.bind(this,i)}>
          <div className={character.completed[this.props.deed_category_selected][i]?'deed-details completed':'deed-details'}>
            <p>{deed.Details}</p>
            {deed.Faction && <p className='deed-stats'>Faction: {deed.Faction}</p>}
            {deed.Type && <p className='deed-stats'>Type: {deed.Type}</p>}
            {deed.LP && <p className='deed-stats'>LP: {deed.LP}</p>}
            {deed.Trait && <p className='deed-stats'>Trait: {deed.Trait}</p>}
            {deed.Title && <p className='deed-stats'>Title: {deed.Title}</p>}
            {deed.Level && <p className='deed-stats'>Level: {deed.Level}</p>}
            {deed.Party && <p className='deed-stats'>Party: {deed.Party}</p>}
            {character.completed[this.props.deed_category_selected][i] ? (
              <Button className='deed-completed-btn btn btn-success' text='Completed!'
                onClick={this.handle_deed_complete.bind(this, this.props.deed_category_selected)}/>
            ):(
              <Button className='deed-completed-btn btn btn-primary' text='Complete?'
                onClick={this.handle_deed_complete.bind(this, this.props.deed_category_selected)}/>
            )}
          </div>
        </Deed>
        ):(
          <Deed key={i} name={deed.Deed} selected={false} onClick={this.handle_selected.bind(this,i)}/>
        )
    });

    //build nav bar selecting active tab
    let deed_categories = this.props.deed_categories.map((category,i)=>{

      return i === this.props.deed_category_selected ? (
        <p key={i} className='clickable deed-nav-link active' onClick={this.handle_category_click.bind(this, i)}>{category}</p>
      ):(
        <p key={i} className='clickable deed-nav-link' onClick={this.handle_category_click.bind(this, i)}>{category}</p>
      )
    });

    //build subcategories
    let subcategories = [...this.props.deed_subcatetories].map((subcategory,i)=>{
      return subcategory === this.props.deed_subcategory_selected ? (
        <p key={i} className='clickable deed-nav-link active' onClick={this.handle_subcategory_click.bind(this, subcategory)}>{subcategory}</p>
      ):(
        <p key={i} className='clickable deed-nav-link' onClick={this.handle_subcategory_click.bind(this, subcategory)}>{subcategory}</p>
      )
    });

    //render the completed deed panel
    return(
      <div className='container panel deed-panel'>
        <h3 className='panel-header'>Deeds</h3>
        <h4>Category:</h4>
        <List list_class='deed-nav' list_item_class='deed-nav-item'>
          {deed_categories}
        </List>
        <h4>Subcategory:</h4>
        <List list_class='deed-nav' list_item_class='deed-nav-item'>
          {subcategories}
        </List>
        <h4>Deeds:</h4>
        <Panel panel_class='col deed-panel-left'>
          <List list_class='deed-list' list_item_class='deed-list-item'>
            {deed_list}
          </List>
        </Panel>
      </div>
    );
  }
}


export default DeedPanel;
