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
import { Component } from "react";
import { List, Panel, Button, SelectObject, TextInput, Modal } from "./Common";
import { RACES, CLASSES, ACTION_TYPES, DEED_CATEGORIES } from "constants";
import { getStore } from "Store";
import { openDatabase, delete_character } from "database";

import "./CharacterPanel.scss";

/**
 *
 *
 * @param {{
 * name: string;
 * race: string;
 * class: string;
 * level: string;
 * selected: boolean;
 * onChange: React.ChangeEventHandler;
 * onSelected: React.MouseEventHandler;
 * }} props
 * @returns {JSX.Element}
 */
function Character(props) {
  return (
    <div className={props.selected ? "character selected" : "character"}>
      <TextInput
        div_class="character-form-div"
        className="character-form"
        label_class="character-label"
        name="character-name"
        value={props.name}
        label="Name: "
        onChange={props.onChange}
      />
      <SelectObject
        div_class="character-form-div"
        className="character-form"
        label_class="character-label"
        name="character-race"
        object={RACES}
        default={props.race}
        label="Race: "
        onChange={props.onChange}
      />
      <SelectObject
        div_class="character-form-div"
        className="character-form"
        label_class="character-label"
        name="character-class"
        object={CLASSES}
        default={props.class}
        label="Class: "
        onChange={props.onChange}
      />
      <TextInput
        div_class="character-form-div"
        className="character-form"
        label_class="character-label"
        name="character-level"
        value={props.level}
        label="Level: "
        onChange={props.onChange}
      />
      <div className="character-form-div">
        <Button
          className="btn btn-primary character-form"
          text="Select"
          onClick={props.onSelected}
        />
      </div>
    </div>
  );
}

/**
 * @typedef {{
 * characters: import('database').CharacterData[];
 * selected_character: number;
 * }} CharacterPanelProps
 */

/**
 * @typedef {{
 * show_upload_modal: boolean;
 * filename: string;
 * }} CharacterPanelState
 */

class CharacterPanel extends Component {
  /** @type {CharacterPanelProps} */
  props;
  /** @type {CharacterPanelState} */
  state;

  /**
   *
   *
   * @param {CharacterPanelProps} props
   */
  constructor(props) {
    super(props);

    this.state = {
      show_upload_modal: false,
      filename: "none selected...",
    };

    this.handleAddCharacter = this.handleAddCharacter.bind(this);
    this.handleSaveAll = this.handleSaveAll.bind(this);
    this.handleDownloadCharacters = this.handleDownloadCharacters.bind(this);
    this.handleDeleteCharacter = this.handleDeleteCharacter.bind(this);
    this.handleUploadCharacterClicked =
      this.handleUploadCharacterClicked.bind(this);
  }

  handleAddCharacter() {
    //create new character object
    let character = {
      name: "",
      race: "",
      class: "",
      level: 1,
      completed: [
        //create all the dummy deed completed arrays required for a new character
        ...Object.keys(DEED_CATEGORIES).map((_category) => {
          return [false];
        }),
      ],
    };

    let characters = [];
    if (this.props.characters) {
      characters = this.props.characters;
    }

    characters.push(character);

    //add character to global state
    getStore().issueAction(ACTION_TYPES.CHARACTER_ADDED, {
      characters: characters,
    });
  }

  /**
   * called whenever character information is changed
   * @param {number} index
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  handleChange(index, event) {
    let characters = this.props.characters;
    //determine what to update
    switch (event.target.name) {
      case "character-name":
        characters[index].name = event.target.value;
        break;
      case "character-race":
        characters[index].race = event.target.value;
        break;
      case "character-class":
        characters[index].class = event.target.value;
        break;
      case "character-level":
        characters[index].level = event.target.value;
        break;
      default:
        break;
    }

    //update characters in global state
    getStore().issueAction(ACTION_TYPES.CHARACTER_UPDATED, {
      characters: characters,
    });
  }

  //update global state with current selected character index
  /**
   *
   *
   * @param {number} index
   * @param {React.MouseEvent} _event
   * @returns {*}
   */
  selected_handler(index, _event) {
    getStore().issueAction(ACTION_TYPES.CHARACTER_SELECTED, {
      selected_character: index,
      deed_category_selected: -1,
      deed_subcategory_selected: -1,
    });
  }

  async handleSaveAll() {
    const db = await openDatabase();
    const tx = await db.transaction("characters", "readwrite");
    const charactersStore = tx.openStore("characters");

    // create/update all characters in db
    await Promise.all(
      this.props.characters.map((character, i) =>
        charactersStore.put(character, i)
      )
    );

    await tx.commit();
    alert("characters saved!");
  }

  handleDownloadCharacters() {
    //build the blob out of the passed character data
    let blob = new Blob([JSON.stringify(this.props.characters)], {
      type: "text/json",
    });

    //create a temporary anchor
    let a = window.document.createElement("a");

    //create a 'link' to our data blob
    a.href = window.URL.createObjectURL(blob);
    a.download = "lotro_cl_characters.json";

    //append the link, activate it, then immediately remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async handleDeleteCharacter() {
    if (this.props.selected_character < 0) return;
    let characters = this.props.characters;
    characters.splice(this.props.selected_character, 1);
    try {
      const db = await openDatabase();
      await delete_character(db, this.props.selected_character.toString());
      getStore().issueAction(ACTION_TYPES.CHARACTER_DELETED, {
        characters,
        selected_character: -1,
      });
    } catch (error) {
      console.error("handle_delete_character failed...", error);
      alert("character deletion failed...");
    }
  }

  handleUploadCharacterClicked() {
    this.setState({ show_upload_modal: true });
  }

  handle_modal_request_close() {
    this.setState({ show_upload_modal: false });
  }

  /**
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  handleSubmit(event) {
    //prevent default submission behavior (i.e., dont reload the page)
    event.preventDefault();

    if (this.file_input.files.length === 0) {
      alert("You must choose a file to upload!");
      return;
    }

    if (this.file_input.files.length > 1) {
      alert("No more than 1 file can be loaded at a time!");
      return;
    }

    //attempt to read the file
    let reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (typeof event.target.result === "string") {
          //attempt to parse the file into JSON
          /** @type {import('database').CharacterData[]} */
          const data = JSON.parse(event.target.result);

          //add new characters to existing characters
          let characters = this.props.characters;
          data.forEach((character) => {
            characters.push(character);
          });

          //issue the update to the store
          getStore().issueAction(ACTION_TYPES.CHARACTER_ADDED, {
            characters: characters,
            selected_character: -1,
          });
        } else {
          console.error("invalid file submitted");
          alert("please only submit text/json files...");
        }
      } catch (error) {
        console.error("file parsing failed:", error);
        alert("an error occurred, no character data loaded...");
      } finally {
        //close the modal
        this.setState({
          show_upload_modal: false,
          filename: "none selected...",
        });
      }
    };

    //the reader encountered an error
    reader.onerror = (error) => {
      console.error("file read failed:", error);
      alert("an error occurred, no character data loaded...");
      this.setState({ show_upload_modal: false });
    };

    //read the file
    reader.readAsText(this.file_input.files[0]);
  }

  render() {
    let character_list = [];
    //if no characters, there is nothing to render
    if (this.props.characters) {
      //build character list
      character_list = this.props.characters.map((character, i) => {
        return (
          <Character
            key={i}
            name={character.name}
            race={character.race}
            class={character.class}
            level={character.level}
            selected={i === this.props.selected_character}
            onChange={this.handleChange.bind(this, i)}
            onSelected={this.selected_handler.bind(this, i)}
          />
        );
      });
    }

    return (
      <Panel panel_class="panel character-panel">
        <h2 className="panel-header">Characters</h2>
        <div className="character-grid">
          <div className="character-actions">
            {/* <h4>Actions:</h4> */}
            <Button
              className="btn btn-primary"
              text="Add Character"
              onClick={this.handleAddCharacter}
            />
            {/* <Button className='btn btn-success' text='Save All Characters' onClick={this.save_all_handler}/> */}
            <Button
              className="btn btn-danger"
              text="Delete Selected"
              onClick={this.handleDeleteCharacter}
            />
            <Button
              className="btn btn-primary"
              text="Load Characters"
              onClick={this.handleUploadCharacterClicked}
            />
            <Button
              className="btn btn-primary"
              text="Download Characters"
              onClick={this.handleDownloadCharacters}
            />
          </div>
          <div className="character-area">
            {/* <h4>Characters:</h4> */}
            <List
              list_class="character-list"
              list_item_class="character-list-item"
            >
              {character_list}
            </List>
          </div>
          <Modal
            className="modal-content panel"
            overlayClassName="modal"
            isOpen={this.state.show_upload_modal}
            onRequestClose={this.handle_modal_request_close.bind(this)}
          >
            <form onSubmit={this.handleSubmit.bind(this)}>
              <h3 style={{ textAlign: "center", marginTop: "0px" }}>
                Select File to Load
              </h3>
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <label htmlFor="file-load" className="modal-load-label btn">
                  Browse...
                </label>
                <p style={{ fontFamily: "sans-serif", margin: "5px" }}>
                  File: {this.state.filename}
                </p>
              </span>
              <input
                id="file-load"
                type="file"
                ref={(input) => {
                  this.file_input = input;
                }}
                onChange={() => {
                  // get the name of the selected file and
                  this.setState({ filename: this.file_input.files[0].name });
                }}
              />
              <button type="submit" className="btn btn-primary">
                Load File
              </button>
            </form>
          </Modal>
        </div>
      </Panel>
    );
  }
}

export default CharacterPanel;
