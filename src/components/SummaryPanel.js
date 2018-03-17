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

    this.db_promise = open_database();
  }

  componentDidMount(){
    get_all_deeds(this.db_promise).then(data=>{
      this.setState({
        deeds:data
      })
    });
  }

  render(){
    //dont render if no character selected
    if (!this.props.character || !this.state.deeds) return('');

    let total_deeds = 1926;
    let total_deeds_complete = 500;
    let total_quests = 1553;
    let total_quests_complete = 40;

    return(
      <Panel panel_class='container panel summary-panel'>
        <h3 className='panel-header'>Summary for {this.props.character.name}</h3>
        <div className='summary-details'>
          <p style={{display:'inline-flex'}}>Deeds: </p>
          <p className='summary-stat'>Total: {total_deeds}</p>
          <p className='summary-stat'>Total Complete: {total_deeds_complete}</p>
          <p className='summary-stat'>Percent Complete: {(100.0*(total_deeds_complete/total_deeds)).toFixed(2)}%</p>
        </div>
        <div className='summary-details'>
          <p style={{display:'inline-flex'}}>Quests: </p>
          <p className='summary-stat'>Total: {total_quests}</p>
          <p className='summary-stat'>Total Complete: {total_quests_complete}</p>
          <p className='summary-stat'>Percent Complete: {(100.0*(total_quests_complete/total_quests)).toFixed(2)}%</p>
        </div>
      </Panel>
    );
  }
}

export default SummaryPanel;
