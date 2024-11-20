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

import { Component, createRef } from "react";

/**
 * @typedef {{
 * id: string;
 * className: string;
 * onRequestClose: Function;
 * show: boolean;
 * }} ModalProps
 */

export class Modal extends Component {
  /**
   * @param {ModalProps} props
   */
  constructor(props) {
    super(props);
    this.overlayRef = createRef();
    this.contentRef = createRef();
  }

  /**
   * @param {ModalProps} prevProps
   */
  componentDidUpdate(prevProps) {
    // open dialog
    if (this.overlayRef.current && this.props.show && !prevProps.show) {
      this.overlayRef.current.showModal();
    }

    // close dialog
    if (this.overlayRef.current && !this.props.show && prevProps.show) {
      this.overlayRef.current.close();
    }
  }

  /**
   * @param {React.MouseEvent} event
   */
  handleOnClick(event) {
    // close if we click outside the dialog
    if (this.props.show && !this.contentRef.current.contains(event.target)) {
      this.props.onRequestClose();
    }
  }

  render() {
    return (
      <dialog
        ref={this.overlayRef}
        id={this.props.id}
        className={this.props.overlayClassName}
        onClick={this.handleOnClick.bind(this)}
      >
        <div ref={this.contentRef} className={this.props.className}>
          {this.props.children}
        </div>
      </dialog>
    );
  }
}

/**
 *
 *
 * @param {{
 * children: React.ReactNode[];
 * list_class: string;
 * list_item_class: string;
 * }} props
 * @returns {JSX.Element}
 */
export function List(props) {
  if (!props.children) return <></>;

  let list_items = props.children.map((item, i) => {
    return (
      <li key={i} className={props.list_item_class}>
        {item}
      </li>
    );
  });

  return <ul className={props.list_class}>{list_items}</ul>;
}

/**
 * @param {{
 * children: React.ReactNode[];
 * panel_class: string;
 * }} props
 * @returns {JSX.Element}
 */
export function Panel(props) {
  return <div className={props.panel_class}>{props.children}</div>;
}

/**
 * @param {{
 * children: React.ReactNode[];
 * left_class: string;
 * right_class: string;
 * left: React.ReactElement;
 * right: React.ReactElement;
 * panel_class: string
 * }} props
 * @returns {JSX.Element}
 */
export function DoublePanel(props) {
  return (
    <Panel panel_class={props.panel_class}>
      {props.children}
      <div className={props.left_class}>{props.left}</div>
      <div className={props.right_class}>{props.right}</div>
    </Panel>
  );
}

/**
 * button element
 *
 * @param {{
 * className: string;
 * onClick: React.MouseEventHandler<HTMLButtonElement>;
 * text: string
 * }} props
 * @returns {JSX.Element}
 */
export function Button(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.text}
    </button>
  );
}

/**
 * creates a select element
 *
 * @param {Partial<{
 * object: Record<string, {
 * id: string;
 * text: string;
 * }>;
 * div_class: string;
 * label_class: string;
 * id: string;
 * className: string;
 * name: string;
 * label: string;
 * default: any;
 * onChange: React.ChangeEventHandler<HTMLSelectElement>
 * }>} props
 * @returns {JSX.Element}
 */
export function SelectObject(props) {
  let key_list = Object.keys(props.object);
  let options = key_list.map((key, i) => {
    let item = props.object[key];
    return (
      <option key={i} value={item.id}>
        {item.text}
      </option>
    );
  });

  return (
    <div className={props.div_class}>
      <label className={props.label_class} htmlFor={props.id}>
        {props.label}
      </label>
      <select
        className={props.className}
        name={props.name}
        value={props.default}
        onChange={props.onChange}
      >
        {options}
      </select>
    </div>
  );
}

/**
 * creates a text input
 *
 * @param {Partial<{
 * className: string;
 * div_class: string;
 * id: string;
 * label: string;
 * label_class: string;
 * name: string;
 * onChange: React.ChangeEventHandler<HTMLInputElement>
 * placeholder: string
 * value: string;
 * }>} props
 * @returns {JSX.Element}
 */
export function TextInput(props) {
  return (
    <div className={props.div_class}>
      <label className={props.label_class} htmlFor={props.id}>
        {props.label}
      </label>
      <input
        className={props.className}
        type="text"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        placeholder={props.placeholder}
      />
    </div>
  );
}
