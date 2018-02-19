import React, { Component } from 'react';

import {Panel} from './Common';


class SummaryPanel extends Component{
    constructor(){
        super();
        this.state = {

        }
    }

    render(){
        return(
            <Panel panel_class='container panel summary-panel'>
                <h3>Summary Panel</h3>
            </Panel>
        );
    }
}

export default SummaryPanel;