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

function Button(props){
    return(
        <button className={props.button_class} onClick={props.on_click}>
            {props.text}
        </button>
    );
}

/**
 * @param  {} props.object
 * @param  {} props.select_name
 * @param  {} props.default 
 */
function SelectObject(props){
    let key_list = Object.keys(props.object);
    let options = key_list.map((key, i)=>{
        let item = props.object[key];
        if (item.id === props.default){
            return(
                <option value={item.id} selected>{item.text}</option>
            );
        }else{
            return(
                <option value={item.id}>{item.text}</option>
            );
        }
    })

    return(
        <select name={props.select_name}>
            {options}
        </select>
    );
}

export {DoublePanel, List, Panel, Button, SelectObject};