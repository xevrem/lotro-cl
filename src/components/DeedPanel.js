import React, { Component } from 'react';
import './DeedPanel.css';

import {DoublePanel, List, Panel, Button} from './Common';
import {ACTION_TYPES} from './../constants';

import {get_store} from './../Store';

const Deed = props =>{
  return(
    <div className={props.selected?'deed row selected':'deed row'}>
      <p className='col text-left'>{props.name}</p>
      <Button className='col-2 btn btn-primary' text='select' onClick={props.onClick}/>
    </div>
  );
}


class DeedPanel extends Component{
  constructor(){
    super();
    this.state = {
      name:'Deed Panel',
      deeds: ['Totam vero officia dolorum iure minus nisi',
      'nostrum provident reiciendis laudantium voluptatibus',
      'expedita laborum recusandae quasi esse sit enim suscipit'],
      deed_types:['Class','Race','Epic','Reputation','Eriador', 'Rhovanion',
       'Gondor', 'Mordor', 'Skirmish', 'Instances', 'Hobbies'],
      deed_text:['Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam vero officia dolorum iure minus nisi, nostrum provident reiciendis laudantium voluptatibus expedita laborum recusandae quasi esse sit enim suscipit mollitia odio?',
      'nostrum provident reiciendis laudantium voluptatibus expedita laborum recusandae quasi esse sit enim suscipit mollitia odio? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam vero officia dolorum iure minus nisi,',
      'voluptatibus expedita laborum recusandae quasi esse sit enim suscipit mollitia odio? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam vero officia dolorum iure minus nisi, nostrum provident reiciendis laudantium'],
      completed:[false,false,false]
    }
    this.nav_click_handler = this.handle_nav_click.bind(this);
    this.deed_complete_handler = this.handle_deed_complete.bind(this);
  }

  handle_nav_click(event){
      console.log('nav clicked...', event.target.text);
  }

  handle_deed_complete(event){
    console.log('deed complete...', this.props.selected_deed);
    let update = this.state.completed
    update[this.props.selected_deed] = update[this.props.selected_deed] ? false:true;
    this.setState({
      completed: update
    })
  }

  selected_handler(index, event){
    get_store().issue_action(ACTION_TYPES.DEED_SELECTED, {selected_deed:index});
  }

  render(){
    let deed_list = this.state.deeds.map((deed,i)=>{
      return <Deed key={i} name={deed} selected={i === this.props.selected_deed} onClick={this.selected_handler.bind(this,i)}/>
    })

    let deed_types = this.state.deed_types.map((deed_type,i)=>{
      if (i === 0 ){
        return <a key={i} className='nav-link active' href='#' target='_self' onClick={this.nav_click_handler}>{deed_type}</a>
      }else{
        return <a key={i} className='nav-link' href='#' target='_self' onClick={this.nav_click_handler}>{deed_type}</a>
      }
    });

    return(
      <div className='container panel deed-panel'>
        <h3>Deed Panel</h3>
        <List list_class='nav nav-tabs' list_item_class='nav-item'>
          {deed_types}
        </List>
        <DoublePanel panel_class='row' left_class='col deed-panel-left'
          left={
            <List list_class='deed-list' list_item_class='deed-list-item'>
              {deed_list}
            </List>
          } right_class={this.state.completed[this.props.selected_deed]?'col deed-panel-right completed':'col deed-panel-right'}
          right={
            <Panel panel_class='deed-details-panel'>
              <p className='deed-text'>{this.state.deed_text[this.props.selected_deed]}</p>
              {this.state.completed[this.props.selected_deed] ? (
                <Button className='btn btn-success' text='Completed!' onClick={this.deed_complete_handler}/>
              ):(
                <Button className='btn btn-primary' text='Complete?' onClick={this.deed_complete_handler}/>
              )}
            </Panel>
          }/>
      </div>
    );
  }
}


export default DeedPanel;
