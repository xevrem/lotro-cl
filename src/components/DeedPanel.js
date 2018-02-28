import React, { Component } from 'react';
import './DeedPanel.css';

import {DoublePanel, List, Panel, Button} from './Common';
import {ACTION_TYPES} from './../constants';

import {get_store} from './../Store';

/**
 * [Deed description]
 * @param {[type]} props [description]
 */
const Deed = props =>{
  return(
    <div className={props.selected?'deed clickable selected':'deed clickable'} onClick={props.onClick}>
      <p className='col text-left' >{props.name}</p>
      {props.children}
    </div>
  );
}


class DeedPanel extends Component{
  constructor(){
    super();
    this.deed_complete_handler = this.handle_deed_complete.bind(this);
  }

  handle_nav_click(index, event){
      // console.log('nav clicked...', event.target.text);
      get_store().issue_action(ACTION_TYPES.DEED_NAV_CHANGED,{deed_nav:index});
  }

  handle_deed_complete(event){
    // console.log('deed complete...', this.props.selected_deed);
    let update = this.props.completed
    update[this.props.selected_deed] = update[this.props.selected_deed] ? false : true;
    get_store().issue_action(ACTION_TYPES.DEED_COMPLETED,{completed:update});
  }

  handle_selected(index, event){
    get_store().issue_action(ACTION_TYPES.DEED_SELECTED, {selected_deed:index});
  }

  render(){
    //if no deeds, there is nothing to render
    if(!this.props.deeds) return('');

    //build list of deeds to display
    let deed_list = this.props.deeds.map((deed,i)=>{
      return i === this.props.selected_deed ? (
        <Deed key={i} name={deed.Deed} selected={true} onClick={this.handle_selected.bind(this,i)}>
          <div className={this.props.completed[i]?'deed-details completed':'deed-details'}>
            <p>{deed.Details}</p>
            <p className='deed-stats'>Region: {deed.Subregion}</p>
            <p className='deed-stats'>Faction: {deed.Faction}</p>
            <p className='deed-stats'>Type: {deed.Type}</p>
            <p className='deed-stats'>LP: {deed.LP}</p>
            <p className='deed-stats'>Trait: {deed.Trait}</p>
            <p className='deed-stats'>Title: {deed.Title}</p>
            <p className='deed-stats'>Level: {deed.Level}</p>
            <p className='deed-stats'>Party: {deed.Party}</p>
            {this.props.completed[this.props.selected_deed] ? (
              <Button className='deed-completed-btn btn btn-success' text='Completed!' onClick={this.deed_complete_handler}/>
            ):(
              <Button className='deed-completed-btn btn btn-primary' text='Complete?' onClick={this.deed_complete_handler}/>
            )}
          </div>
        </Deed>
      ):(
        <Deed key={i} name={deed.Deed} selected={false} onClick={this.handle_selected.bind(this,i)}/>
      )
    })

    //build nav bar selecting active tab
    let deed_types = this.props.deed_types.map((deed_type,i)=>{
      return i === this.props.deed_nav ? (
        <p key={i} className='clickable deed-nav-link active' onClick={this.handle_nav_click.bind(this, i)}>{deed_type}</p>
      ):(
        <p key={i} className='clickable deed-nav-link' onClick={this.handle_nav_click.bind(this, i)}>{deed_type}</p>
      )
    });

    //render the completed deed panel
    return(
      <div className='container panel deed-panel'>
        <h3 className='panel-header'>Deed Panel</h3>
        <List list_class='deed-nav' list_item_class='deed-nav-item'>
          {deed_types}
        </List>
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
