import React, { Component } from 'react';

import {Panel} from './Common';

import {get_store} from './../Store';


class SummaryPanel extends Component{
    constructor(){
        super();
        this.state = {

        }
    }

    componentDidMount(){
      let store = get_store();
      console.log('current character:',store.state.selected_character);
    }

    process_current_summary(){
      return false;
    }

    render(){
        return(
            <Panel panel_class='container panel summary-panel'>
                <h3 className='panel-header'>Summary Panel</h3>
            </Panel>
        );
    }
}

export default SummaryPanel;