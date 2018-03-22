import React, { Component } from 'react';
import ReactModal from 'react-modal';
import './CharacterPanel.css';

import {List, Panel, Button, SelectObject, TextInput} from './Common';
import {RACES, CLASSES, ACTION_TYPES} from './../constants'
import {get_store} from './../Store';
import {open_database, clear_characters} from './../database';

const Character = props =>{
  return (
    <div className={props.selected ? 'character selected':'character'}>
      <TextInput div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-name' value={props.name} label='Name: ' onChange={props.onChange}/>
      <SelectObject div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-race' object={RACES} default={props.race} label='Race: ' onChange={props.onChange}/>
      <SelectObject div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-class' object={CLASSES} default={props.class} label='Class: ' onChange={props.onChange}/>
      <TextInput div_class='character-form-div' className='character-form' label_class='character-label'
        name='character-level' value={props.level} label='Level: ' onChange={props.onChange}/>
      <div className='character-form-div'>
        <Button className='btn btn-primary character-form' text='Select' onClick={props.onSelected}/>
      </div>
    </div>
  );
}

class CharacterPanel extends Component{
  constructor(props){
    super(props);

    this.state = {
      show_upload_modal: false
    }

    this.add_character_handler = this.handle_add_character.bind(this);
    this.save_all_handler = this.handle_save_all.bind(this);
    this.download_characters_handler = this.handle_download_characters.bind(this);
    this.delete_character_handler = this.handle_delete_character.bind(this);
  }

  componentDidMount(){
    console.log(this.props.characters)
  }

  handle_add_character(){
    console.log('button clicked...');

    //create new character object
    let character = {
      name:'',
      race:'',
      class:'',
      level: 1,
      completed:[
        [],[],[],[],[],[],[],[],[],[],[]
      ]
    };

    let characters = this.props.characters;
    characters.push(character);

    //update global state
    get_store().issue_action(ACTION_TYPES.CHARACTER_ADDED, {characters:characters});
  }

  ///called whenever character information is changed
  handle_change(index, event){
    // console.log('handle_change called', index);
    let characters = this.props.characters;
    //determine what to update
    switch(event.target.name){
      case 'character-name':
        characters[index].name = event.target.value
        break;
      case 'character-race':
        characters[index].race = event.target.value
        break;
      case 'character-class':
        characters[index].class = event.target.value
        break;
      case 'character-level':
        characters[index].level = event.target.value
        break;
      default:
        break;
    }

    get_store().issue_action(ACTION_TYPES.CHARACTER_UPDATED, {characters: characters});
  }

  //update global state with current selected character index
  selected_handler(index, event){
    get_store().issue_action(ACTION_TYPES.CHARACTER_SELECTED, {
      selected_character:index,
      deed_category_selected: -1,
      deed_subcategory_selected: -1
    })
  }

  handle_save_all(){
    let db_promise = open_database();
    db_promise.then(db=>{
      let tx = db.transaction('characters', 'readwrite');
      let character_store = tx.objectStore('characters');

      //create/update all characters in db
      this.props.characters.forEach((character,i)=>{
        character_store.put(character,i);
      });

      return tx.complete;
    }).then(()=>{
      console.log('characters saved...');
      alert('characters saved!');
    })
  }

  handle_download_characters(){
    console.log('download_characters called...');

    //build the blob out of the passed character data
    let blob = new Blob([JSON.stringify(this.props.characters)]);

    //create a temporary anchor
    let a = window.document.createElement("a");

    //create a 'link' to our data blob
    a.href = window.URL.createObjectURL(blob, {type: "text/json"});
    a.download = "lotro_cl_characters.json";

    //append the link, activate it, then immediately remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  handle_delete_character(){
    console.log('handle_delete_character called...')
    if(this.props.selected_character < 0) return;

    let characters = this.props.characters;
    characters.splice(this.props.selected_character, 1);

    let db_promise = open_database();
    clear_characters(db_promise).then(()=>{
      get_store().issue_action(ACTION_TYPES.CHARACTER_DELETED,{
        characters:characters,
        selected_character:-1
      });
    }).catch(error=>{
      console.log('handle_delete_character failed...', error);
    })
  }

  handle_upload_character_clicked(){
    console.log('handle_upload_character_clicked called...')
    this.setState({show_upload_modal: true});
  }

  handle_modal_request_close(){
    console.log('handle_upload_focus_loss called...')
    this.setState({show_upload_modal: false});
  }

  handle_submit(event){
    //prevent default submission behavior (i.e., dont reload the page)
    event.preventDefault();

    if(this.file_input.files.length === 0){
      alert('You must choose a file to upload!');
      return;
    }

    console.log('handle_submit called...', this.file_input.files[0].name);

    if(this.file_input.files.length > 1){
      alert('No more than 1 file can be loaded at a time!');
      return;
    }

    //attempt to read the file
    let reader = new FileReader();
    reader.onload = event =>{
      try{
        //attempt to parse the file into JSON
        let data = JSON.parse(event.target.result)

        //add new characters to existing characters
        let characters = this.props.characters;
        data.forEach(character=>{
          characters.push(character);
        });

        //issue the update to the store
        get_store().issue_action(ACTION_TYPES.CHARACTER_ADDED, {
          characters:characters,
          selected_character: -1
        });
      }catch(error){
        console.log('file parsing failed:', error);
        alert('an error occurred, no character data loaded...');
      }finally{
        //close the modal
        this.setState({show_upload_modal:false});
      }
    }

    //the reader encountered an error
    reader.onerror = error =>{
      console.log('file read failed:', error);
      alert('an error occurred, no character data loaded...');
      this.setState({show_upload_modal:false});
    }

    //read the file
    reader.readAsText(this.file_input.files[0]);
  }

  render (){

    let character_list = [];
    //if no characters, there is nothing to render
    if(this.props.characters){
      //build character list
      character_list = this.props.characters.map((character, i) =>{
        return (
          <Character key={i} name={character.name} race={character.race}
            class={character.class} level={character.level}
            selected={i === this.props.selected_character}
            onChange={this.handle_change.bind(this, i)}
            onSelected={this.selected_handler.bind(this, i)}/>
        );
      })
    }

    return(
      <Panel panel_class='panel character-panel'>
        <h3 className='panel-header'>Characters</h3>
        <div className='character-grid'>
          <div className='character-actions'>
            <h4>Actions:</h4>
            <Button className='btn btn-primary' text='Add Character' onClick={this.add_character_handler}/>
            {/* <Button className='btn btn-success' text='Save All Characters' onClick={this.save_all_handler}/> */}
            <Button className='btn btn-danger' text='Delete Selected' onClick={this.delete_character_handler}/>
            <Button className='btn btn-primary' text='Load Characters' onClick={this.handle_upload_character_clicked.bind(this)}/>
            <Button className='btn btn-primary' text='Download Characters' onClick={this.download_characters_handler}/>
          </div>
          <div className='character-area'>
            <h4>Characters:</h4>
            <List list_class='character-list' list_item_class='character-list-item'>
              {character_list}
            </List>
          </div>
          <ReactModal
            className='modal-content panel'
            overlayClassName='modal'
            isOpen={this.state.show_upload_modal}
            onRequestClose={this.handle_modal_request_close.bind(this)}>
              <form className='' onSubmit={this.handle_submit.bind(this)}>
                <h3>Select File to Load</h3>
                <label htmlFor="file-load" className='modal-load-label btn'>
                  Browse...
                </label>
                <input id='file-load' type="file" ref={input=>{this.file_input = input}} onChange={event=>{console.log(this.Files)}}/>
                <button type="submit" className='btn btn-primary'>Load File</button>
              </form>
          </ReactModal>
        </div>
      </Panel>
    );
  }
}

export default CharacterPanel;
