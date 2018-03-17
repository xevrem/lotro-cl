/*
* Custom Common React Components
*
*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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

/**
 * [Modal description]
 * @extends Component
 */
class Modal extends Component{
  constructor(props){
    super(props);

    this.focus_loss_handler = this.focus_loss_handler.bind(this);
    this.component_cleanup = this.component_cleanup.bind(this);
  }

  componentDidMount () {
    console.log('componentWillUnmount called...');
    document.addEventListener('click', this.focus_loss_handler);
    window.addEventListener('beforeunload', this.component_cleanup);
  }

  componentWillUnmount () {
    console.log('componentWillUnmount called...');
    this.cleanup();
    window.removeEventListener('beforeunload', this.component_cleanup);
  }

  component_cleanup(){
    console.log('component_cleanup called...');
    document.removeEventListener('click', this.focus_loss_handler);
  }

  focus_loss_handler(event){
    console.log('on_focus_loss_handler called...', event);

    const area = ReactDOM.findDOMNode(this.refs.modal_content);

    if (!area.contains(event.target)) {
      if(this.props.is_visible){
        this.props.onFocusLoss(event);
      }
    }
  }

  render(){
    let class_name = this.props.className || 'modal';
    let content_class_name = this.props.conentClassName || 'modal-content';

    return (
      <div className={class_name} style={this.props.is_visible ? {display:'block'}:{display:'none'}}>
        <div className={content_class_name} ref='modal_content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export {DoublePanel, List, Panel, Button, SelectObject, TextInput, Modal};
