import React, { Component } from 'react';
import './DeedPanel.css';

import {DoublePanel, List, Panel, Button} from './Common';


const Deed = props =>{
    return(
        <div className='deed row'>
            <p className='col text-left'>{props.name}</p>
            <Button className='col-2 btn btn-primary' text='select'/>
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
             'Gondor', 'Mordor', 'Skirmish', 'Instances', 'Hobbies']
        }
    }

    handle_nav_click(event){
        console.log('nav clicked...', event);
    }

    render(){
        let deed_list = this.state.deeds.map(deed=>{
            return <Deed name={deed}/>
        })

        let nav_click_handler = this.handle_nav_click.bind(this);
        let deed_types = this.state.deed_types.map((deed_type,i)=>{
            if (i === 0 ){
                return <a className='nav-link active' href='#' target='_self' onClick={nav_click_handler}>{deed_type}</a>
            }else{
                return <a className='nav-link' href='#' target='_self' onClick={nav_click_handler}>{deed_type}</a>
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
                } right_class='col deed-panel-right' 
                right={
                    <Panel panel_class='deed-details-panel'>
                        <p className='deed-text'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam vero officia 
                            dolorum iure minus nisi, nostrum provident reiciendis laudantium voluptatibus 
                            expedita laborum recusandae quasi esse sit enim suscipit mollitia odio?</p>
                        <Button className='btn btn-primary' text='Complete?'/>
                    </Panel>
                }/>
            </div>
        );
    }
}


export default DeedPanel;