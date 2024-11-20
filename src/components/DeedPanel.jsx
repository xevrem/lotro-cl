/*
Copyright 2018 Erika Jonell

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
import React, { Component } from "react";
import "./DeedPanel.scss";

import { Button } from "./Common";
import { ACTION_TYPES, DEED_CATEGORIES } from "./../constants";

import { getStore } from "./../Store";

/**
 * a deed item
 *
 * @param {Partial<{
 * name: string;
 * selected: boolean;
 * completed: boolean;
 * onClick: React.MouseEventHandler<HTMLDivElement>;
 * children: React.ReactNode[];
 * }>} props
 * @returns {JSX.Element}
 */
function Deed(props) {
  const { name, selected, completed, onClick, children } = props;
  //calculate which classes to add
  let is_selected = selected ? "deed clickable selected " : "deed clickable ";
  let is_completed = completed ? "completed" : "";
  return (
    <div className={is_selected + is_completed} onClick={onClick}>
      <p>{name}</p>
      {children}
    </div>
  );
}

/**
 * @typedef {{
 * characters: import("database").CharacterData[];
 * deeds: import("database").DeedData[];
 * deed_category_selected: number;
 * deed_categories: string[];
 * deed_subcatetories: string[];
 * deed_subcategory_selected: string;
 * deed_text: string;
 * selected_character: number;
 * selected_deed: number;
 * }} DeedPanelProps
 */
/**
 * @typedef {{
 *  width: number;
 * }} DeedPanelState
 */

/**
 * a panel of deeds
 */
class DeedPanel extends Component {
  /** @type {DeedPanelProps} */
  props;
  /** @type {DeedPanelState} */
  state;

  /**
   * @param {DeedPanelProps} props
   */
  constructor(props) {
    super(props);

    this.state = {
      width: getStore().getState().width,
    };

    //this.handle_deed_complete = this.handle_deed_complete.bind(this);
    this.renderDeedDetails = this.renderDeedDetails.bind(this);
  }

  /**
   * @param {number} index
   * @param {React.MouseEvent} _event
   */
  handleCategoryClick(index, _event) {
    // console.log('nav clicked...', event.target.text);
    getStore().issueAction(ACTION_TYPES.DEED_CATEGORY_CHANGED, {
      deed_category_selected: index,
    });
  }

  /**
   * @param {string} deed_type
   * @param {React.MouseEvent} _event
   */
  handleDeedComplete(deed_type, _event) {
    // console.log('deed complete...', this.props.selected_deed);

    //toggle the specific deed
    let update = this.props.characters[this.props.selected_character].completed;
    update[deed_type][this.props.selected_deed] = update[deed_type][
      this.props.selected_deed
    ]
      ? false
      : true;

    //update the character deed completion data
    let updated_characters = this.props.characters;
    updated_characters[this.props.selected_character].completed = update;
    getStore().issueAction(ACTION_TYPES.CHARACTER_UPDATED, {
      characters: updated_characters,
    });
  }

  /**
   * @param {number} index
   * @param {React.MouseEvent} _event
   */
  handleSelected(index, _event) {
    getStore().issueAction(ACTION_TYPES.DEED_SELECTED, {
      selected_deed: index,
    });
  }

  /**
   * @param {number} index
   * @param {React.MouseEvent} _event
   */
  handleSubcategoryClick(index, _event) {
    getStore().issueAction(ACTION_TYPES.DEED_SUBCATEGORY_CHANGED, {
      deed_subcategory_selected: index,
    });
  }

  /**
   *
   * @param {string} deed_type
   * @param {number} category
   * @returns {string}
   */
  deed_type_to_text(deed_type, category) {
    switch (deed_type) {
      case "C":
        return "Class";
      case "E":
        return "Exploration";
      case "F":
        return "Festival";
      case "L":
        return "Lore";
      case "M":
        return "Meta";
      case "Q":
        return "Quest";
      case "R":
        return category === DEED_CATEGORIES.RACE ? "Race" : "Reputation";
      case "S":
        return "Slayer";
      case "So":
        return "Social";
      default:
        return deed_type;
    }
  }

  /**
   * renders the deed details for the given character, deed and completion index
   * @param  {*} deed      deed for which details will be displayed
   * @param  {*} character character from which completion data will be retrieved
   * @param  {*} index     index within the current category of deeds
   * @return {*}           deed details element
   */
  renderDeedDetails(deed, character, index) {
    return (
      <div
        className={
          character.completed[this.props.deed_category_selected][index]
            ? "deed-details completed"
            : "deed-details"
        }
      >
        <p>{deed.Details}</p>
        {deed.Faction && <p className="deed-stats">Faction: {deed.Faction}</p>}
        {deed.Type && (
          <p className="deed-stats">
            Type:{" "}
            {this.deed_type_to_text(
              deed.Type,
              this.props.deed_category_selected
            )}
          </p>
        )}
        {deed.LP && deed.LP !== "-" && (
          <p className="deed-stats">LP: {deed.LP}</p>
        )}
        {deed.Trait && <p className="deed-stats">Trait: {deed.Trait}</p>}
        {deed.Title && <p className="deed-stats">Title: {deed.Title}</p>}
        {deed.Level && <p className="deed-stats">Level: {deed.Level}</p>}
        {deed.Party && <p className="deed-stats">Party: {deed.Party}</p>}
        {character.completed[this.props.deed_category_selected][index] ? (
          <Button
            className="deed-completed-btn btn btn-success"
            text="Completed!"
            onClick={this.handleDeedComplete.bind(
              this,
              this.props.deed_category_selected
            )}
          />
        ) : (
          <Button
            className="deed-completed-btn btn btn-primary"
            text="Complete?"
            onClick={this.handleDeedComplete.bind(
              this,
              this.props.deed_category_selected
            )}
          />
        )}
      </div>
    );
  }

  render() {
    //if no deeds, there is nothing to render
    if (
      !this.props.deeds ||
      !this.props.deed_subcatetories ||
      this.props.selected_character < 0 ||
      !this.props.characters
    )
      return "";

    let character = this.props.characters[this.props.selected_character];

    //build nav bar selecting active tab
    let deed_categories = this.props.deed_categories.map((category, i) => {
      return i === this.props.deed_category_selected ? (
        <Button
          key={i}
          className="clickable deed-nav-link active"
          text={category}
          onClick={this.handleCategoryClick.bind(this, i)}
        />
      ) : (
        <Button
          key={i}
          className="clickable deed-nav-link"
          text={category}
          onClick={this.handleCategoryClick.bind(this, i)}
        />
      );
    });

    //build subcategories
    let subcategories = [...this.props.deed_subcatetories].map(
      (subcategory, i) => {
        return subcategory === this.props.deed_subcategory_selected ? (
          <Button
            key={i}
            className="clickable deed-nav-link active"
            text={subcategory}
            onClick={this.handleSubcategoryClick.bind(this, subcategory)}
          />
        ) : (
          <Button
            key={i}
            className="clickable deed-nav-link"
            text={subcategory}
            onClick={this.handleSubcategoryClick.bind(this, subcategory)}
          />
        );
      }
    );

    // build list of deeds to display
    let deed_list = this.props.deeds.map((deed, i) => {
      //filter non-selected subcategories
      if (deed.Subcategory !== this.props.deed_subcategory_selected) return null;

      //is this deed completed?
      let completed = false;
      if (this.props.deed_category_selected >= 0) {
        if (character.completed[this.props.deed_category_selected]) {
          completed = character.completed[this.props.deed_category_selected][i];
        }
      }

      //build the deed according to whether it is selected, its information, and if it is completed.
      return i === this.props.selected_deed ? (
        <div key={i} className="deed-list-item">
          <Deed
            name={deed.Deed}
            selected={true}
            completed={completed}
            onClick={this.handleSelected.bind(this, i)}
          >
            {this.renderDeedDetails(deed, character, i)}
          </Deed>
        </div>
      ) : (
        <div key={i} className="deed-list-item">
          <Deed
            name={deed.Deed}
            selected={false}
            completed={completed}
            onClick={this.handleSelected.bind(this, i)}
          />
        </div>
      );
    });

    //render the completed deed panel
    return (
      <div className="container panel deed-panel">
        <h2 className="panel-header">Deed Completion</h2>
        <div className="deed-grid">
          <div className="deed-panel-left nav-grid">
            <div className="nav-left">
              <h3>Category:</h3>
              <div className="deed-nav">{deed_categories}</div>
            </div>
            <div className="nav-right">
              <h3>Subcategory:</h3>
              <div className="deed-nav">{subcategories}</div>
            </div>
          </div>
          <div className="deed-panel-right">
            <h3>Deeds:</h3>
            <div className="deed-list deed-details-grid">{deed_list}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeedPanel;
