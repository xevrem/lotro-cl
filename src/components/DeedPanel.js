import React, { Component } from 'react';
import './DeedPanel.css';

import {DoublePanel, List, Panel, Button} from './Common';
import {ACTION_TYPES} from './../constants';

import {get_store} from './../Store';

const Deed = props =>{
  return(
    <div className={props.selected?'deed clickable row selected':'deed clickable row'} onClick={props.onClick}>
      <p className='col text-left' >{props.name}</p>
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
    //build list of deeds to display
    let deed_list = this.props.deeds.map((deed,i)=>{
      return <Deed key={i} name={deed} selected={i === this.props.selected_deed} onClick={this.handle_selected.bind(this,i)}/>
    })

    //build nav bar selecting active tab
    let deed_types = this.props.deed_types.map((deed_type,i)=>{
      return i === this.props.deed_nav ? ( 
        <p key={i} className='clickable nav-link active' onClick={this.handle_nav_click.bind(this, i)}>{deed_type}</p>
      ):(
        <p key={i} className='clickable nav-link' onClick={this.handle_nav_click.bind(this, i)}>{deed_type}</p>
      )
    });

    //render the completed deed panel
    return(
      <div className='container panel deed-panel'>
        <h3>Deed Panel</h3>
        <List list_class='nav nav-pills' list_item_class='nav-item'>
          {deed_types}
        </List>
        <DoublePanel panel_class='row' left_class='col deed-panel-left'
          left={
            <List list_class='deed-list' list_item_class='deed-list-item'>
              {deed_list}
            </List>
          } right_class={this.props.completed[this.props.selected_deed]?'col deed-panel-right completed':'col deed-panel-right'}
          right={
            <Panel panel_class='deed-details-panel'>
              <p className='deed-text'>{this.props.deed_text[this.props.selected_deed]}</p>
              {this.props.completed[this.props.selected_deed] ? (
                <Button className='deed-completed-btn btn btn-success' text='Completed!' onClick={this.deed_complete_handler}/>
              ):(
                <Button className='deed-completed-btn btn btn-primary' text='Complete?' onClick={this.deed_complete_handler}/>
              )}
            </Panel>
          }/>
      </div>
    );
  }
}


export default DeedPanel;
