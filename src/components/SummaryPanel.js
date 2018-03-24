import React, { Component } from 'react';
import './SummaryPanel.css';

import {Panel} from './Common';

import {get_store} from './../Store';
import {ACTION_TYPES} from './../constants';
import {open_database, get_all_deeds} from './../database';


class SummaryPanel extends Component{
  constructor(props){
    super(props);
    this.state = {deeds:null}

    //ensure deeds are loaded after initialization is complete
    get_store().subscribe(ACTION_TYPES.INITIALIZATION_DONE, this.handle_deeds_update.bind(this));
  }

  handle_deeds_update(state, action){
    //refresh deed data
    let db_promise = open_database();
    get_all_deeds(db_promise).then(data=>{
      this.setState({
        deeds:data
      })
    });
  }

  render(){
    //dont render if no character selected
    if (!this.props.characters || this.props.selected_character < 0 || !this.state.deeds) return('');

    let total_deeds = 0;//1926;
    let total_quests = 0;//1553;

    let total_deeds_complete = 0;//500;
    let total_quests_complete = 0;//40;

    let character = this.props.characters[this.props.selected_character]
    let completed = character.completed;

    //tally deed total counts
    this.state.deeds.forEach((deed_type,i) => {
      deed_type.forEach((deed,j)=>{
        switch(deed.Type){
          case 'Q': //count quests separately
            total_quests++;
            if(completed[i]){
              if(completed[i][j]){
                total_quests_complete++;
              }
            }
            break;
          default:
            total_deeds++;
            if(completed[i]){
              if(completed[i][j]){
                total_deeds_complete++;
              }
            }
            break;
        }
      });
    });

    //account for potential NaNs
    let percent_deeds = (100.0*(total_deeds_complete/total_deeds)).toFixed(2);
    let percent_quests = (100.0*(total_quests_complete/total_quests)).toFixed(2);
    percent_deeds = percent_deeds === 'NaN' ? 0.00 : percent_deeds;
    percent_quests = percent_quests === 'NaN' ? 0.00 : percent_quests;

    return(
      <Panel panel_class='container panel summary-panel'>
        <h2 className='panel-header'>Summary for {character.name}</h2>
        <div className='summary-details'>
          <p style={{display:'inline-flex'}}>Deeds: </p>
          <p className='summary-stat'>Total: {total_deeds}</p>
          <p className='summary-stat'>Total Complete: {total_deeds_complete}</p>
          <p className='summary-stat'>Percent Complete: {percent_deeds}%</p>
        </div>
        <div className='summary-details'>
          <p style={{display:'inline-flex'}}>Quests: </p>
          <p className='summary-stat'>Total: {total_quests}</p>
          <p className='summary-stat'>Total Complete: {total_quests_complete}</p>
          <p className='summary-stat'>Percent Complete: {percent_quests}%</p>
        </div>
      </Panel>
    );
  }
}

export default SummaryPanel;
