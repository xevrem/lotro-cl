/*
* Custom Common React Components
*
*/

import React, { Component } from 'react';

function List(props) {
    let list_items = props.children.map((item, i) =>{
        return(
            <li key={i} className={props.list_item_class}>
                {item}
            </li>
        );
    });
    return (
        <ul className={props.list_class}>
            {list_items}
        </ul>
    );
}

function Panel(props) {
    return (
        <div className={props.panel_class}>
            {props.children}
        </div>
    );
}

function DoublePanel(props){
    return(
        <Panel panel_class={props.panel_class}>
            <div className={props.left_class}>
                {props.left}
            </div>
            <div className={props.right_class}>
                {props.right}
            </div>
        </Panel>
    );
}

export {DoublePanel, List, Panel};