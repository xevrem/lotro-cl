/*
* Custom Common React Components
*
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function List(props) {
  if(!props.children) return ('');

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
      {props.children}
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
    <button className={props.className} onClick={props.onClick}>
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
    return <option key={i} value={item.id}>{item.text}</option>
  })

  return(
    <div className={props.div_class}>
      <label className={props.label_class} htmlFor={props.id}>{props.label}</label>
      <select className={props.className} name={props.name} value={props.default} onChange={props.onChange}>
        {options}
      </select>
    </div>
  );
}

function TextInput(props){
  return(
    <div className={props.div_class}>
      <label className={props.label_class} htmlFor={props.id}>{props.label}</label>
      <input className={props.className} type='text' id={props.id} value={props.value} onChange={props.onChange} name={props.name} placeholder={props.placeholder} />
    </div>
  );
}

export {DoublePanel, List, Panel, Button, SelectObject, TextInput};
