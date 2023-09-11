/** Copyright 2018 Erika Jonell

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import React from 'react';
import PropTypes from 'prop-types';

function List(props) {
  if(!props.children) return <></>

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

List.propTypes = {
  children: PropTypes.node,
  list_class: PropTypes.string,
  list_item_class: PropTypes.string,
};

function Panel(props) {
  return (
    <div className={props.panel_class}>
      {props.children}
    </div>
  );
}

Panel.propTypes = {
  children: PropTypes.node,
  panel_class: PropTypes.string,
};

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

DoublePanel.propTypes = {
  children: PropTypes.node,
  left_class: PropTypes.string,
  left: PropTypes.element,
  panel_class: PropTypes.string,
  right_class: PropTypes.string,
  right: PropTypes.element
}

function Button(props){
  return(
    <button className={props.className} onClick={props.onClick}>
      {props.text}
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
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
SelectObject.propTypes = {
  className: PropTypes.string,
  div_class: PropTypes.string,
  default: PropTypes.string,
  label_class: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  object: PropTypes.object,
  onChange: PropTypes.func,
}

function TextInput(props){
  return(
    <div className={props.div_class}>
      <label className={props.label_class} htmlFor={props.id}>{props.label}</label>
      <input className={props.className} type='text' id={props.id} value={props.value} 
             onChange={props.onChange} name={props.name} placeholder={props.placeholder} />
    </div>
  );
}

TextInput.propTypes = {
  className: PropTypes.string,
  div_class: PropTypes.string,
  id: PropTypes.string,
  label_class: PropTypes.string,
  label: PropTypes.element,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
}

export {DoublePanel, List, Panel, Button, SelectObject, TextInput};
