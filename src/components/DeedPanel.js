import React, { Component } from 'react';
import './DeedPanel.css';

import {DoublePanel, List, Panel} from './Common';



class DeedPanel extends Component{
    constructor(){
        super();
        this.state = {
            name:'Deed Panel',
            deeds: ['deed 1', 'deed 2']
        }
    }

    render(){
        let foo = this.state.deeds.map((item,i) => {
            return (
                <p>{item}</p>
            );
        });

        return(
            <DoublePanel panel_class='deed-panel' left_class='deed-panel-left' 
            left={
                <List list_class='deed-list' list_item_class='deed-list-item'>
                    {foo}
                </List>
            } right_class='deed-panel-right' 
            right={
                <Panel panel_class='deed-details-panel'>
                    <p>deed details here...</p>
                </Panel>
            } />
        );
    }
}


export default DeedPanel;