import React, { Component } from 'react';
import ReactModal from 'react-modal';
import './LotroApp.css';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';
import SummaryPanel from './SummaryPanel';

import {create_store, get_store} from './../Store';
import {ACTION_TYPES, DEED_CATEGORIES} from './../constants';
import {open_database, initial_deed_population, get_deeds_of_type, save_characters, reset_database} from './../database';
import { Button } from './Common';

let initial_state = {
  selected_character:-1,
  selected_deed:-1,
  deed_category_selected: 0,
  deed_subcategory_selected: '',
  deed_subcategories: null,
  characters: null,
  deeds: null,
  deed_categories: Object.keys(DEED_CATEGORIES),
  //FIXME: have this stored/retrieved from character records
  // completed:[false,false,false]
  width: window.innerWidth,
  height: window.innerHeight
};

//create a store, update interval 16ms, dispatch all queued
create_store(initial_state, 16, -1);

//update window resizing information in store
// const update_window_dimensions = event => {
//   get_store().issue_action(ACTION_TYPES.WINDOW_RESIZE, { width: window.innerWidth, height: window.innerHeight });
// }
// //ensure window resizing is captured
// window.addEventListener('resize', update_window_dimensions);



class LotroApp extends Component {
  constructor(props){
    super(props);
    this.state = get_store().get_state();
    this.db_promise = open_database();

    this.reset_database_handler = this.handle_reset_database.bind(this);

    //create all subscriptions
    get_store().subscribe(ACTION_TYPES.CHARACTER_ADDED, this.handle_character_action.bind(this));
    get_store().subscribe(ACTION_TYPES.CHARACTER_SELECTED, this.handle_character_action.bind(this));
    get_store().subscribe(ACTION_TYPES.CHARACTER_UPDATED, this.handle_character_action.bind(this));
    get_store().subscribe(ACTION_TYPES.CHARACTER_DELETED, this.handle_character_action.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_SELECTED, this.handle_deed_action.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_COMPLETED, this.handle_deed_action.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_UPDATED, this.handle_deed_action.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_CATEGORY_CHANGED, this.handle_deed_category_changed.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_SUBCATEGORY_CHANGED, this.handle_subcategory_changed.bind(this));
    get_store().subscribe(ACTION_TYPES.INITIALIZATION_DONE, this.handle_initialization.bind(this));

    // get_store().subscribe(ACTION_TYPES.WINDOW_RESIZE, (store, action) => {console.log('resize:',action)})
  }

  componentDidMount(){
    console.log('mounted...')

    initial_deed_population(this.db_promise).then(()=>{
      this.retrieve_app_data();
    })
  }

  retrieve_app_data(){
    console.log('build_deed_data called...');

    //get stored character data
    let character_data = new Promise((resolve,reject)=>{
      //attempt to pull data from the db, otherwise fetch
      this.db_promise.then(db=>{
        let tx = db.transaction('characters');
        tx.objectStore('characters').getAll().then(data=>{
          if(data.length>0){
            resolve(data);
          }else{
            // resolve(fetch('/data/characters.json').then(resp=>{
            //   return resp.json();
            // }));
            resolve([]);
          }
        })
      }).catch(error => {
        reject(error);
      });
    });

    //do initial class deed data load
    let class_data = new Promise((resolve,reject)=>{
      this.db_promise.then(db=>{
        db.transaction('deeds').objectStore('deeds').get(DEED_CATEGORIES.CLASS).then(data=>{
          resolve(data);
        });
      }).catch(error=>{
        reject(error);
      });
    });

    //run promises async and set the data
    Promise.all([character_data, class_data]).then(data=>{

      let categories = new Set();

      data[1].forEach(deed=>{
        categories.add(deed.Subcategory);
      });

      get_store().issue_action(ACTION_TYPES.INITIALIZATION_DONE, {
        characters: data[0],
        deeds: data[1],
        deed_subcategories: categories
      });
    }).catch(error=>{
      console.log('retrieve_app_data error:',error);
    })
  }

  handle_initialization(state, data){
    console.log('handle_initialization called...');
    this.setState(data);
  }

  handle_character_action(state, data){
    console.log('handle_character_action called...');
    this.setState(data);

    //save character data into db
    save_characters(this.db_promise, state.characters);
  }

  handle_deed_action(stat, data){
    console.log('handle_deed_action called...');
    this.setState(data);
  }

  switch_deed_category(db_promise, deed_data){
    get_deeds_of_type(db_promise, deed_data.deed_category_selected).then(data=>{
      //create the subcategories
      let subs = new Set();

      data.forEach(deed=>{
        subs.add(deed.Subcategory);
      })

      get_store().issue_action(ACTION_TYPES.DEED_UPDATED, {
        deeds:data,
        deed_subcategories:subs,
        deed_subcategory_selected: ''
      });
    });
  }

  handle_deed_category_changed(state, data){
    console.log('handle_deed_category_changed called...', data);
    this.setState(data);

    //FIXME: this may be fixed later on, but for now switch is needed for development so
    //FIXME: that only existing data can be used
    switch(data.deed_category_selected){
      case DEED_CATEGORIES.CLASS://change to class deeds
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES.RACE:
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES['SHADOWS OF ANGMAR']:
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES['THE MINES OF MORIA']:
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES['ALLIES TO THE KING']:
        this.switch_deed_category(this.db_promise, data);
      break;

      case DEED_CATEGORIES['THE STRENGTH OF SAURON']:
        this.switch_deed_category(this.db_promise, data);
      break;

      case DEED_CATEGORIES['THE BLACK BOOK OF MORDOR']:
        this.switch_deed_category(this.db_promise, data);
      break;

      case DEED_CATEGORIES.REPUTATION:
        this.switch_deed_category(this.db_promise, data);
      break;

      case DEED_CATEGORIES.ERIADOR://change to Eriador deeds
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES.RHOVANION:
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES.GONDOR:
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES.MORDOR:
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES.SKIRMISH:
        this.switch_deed_category(this.db_promise, data);
        break;

      case DEED_CATEGORIES.INSTANCES:
      case DEED_CATEGORIES.HOBBIES:
      default:
        break;
    }
  }

  handle_subcategory_changed(state, data){
    console.log('handle_subcategory_changed called...');
    this.setState(data);
  }

  //purposefully clears entire database
  handle_reset_database(){
    console.log('handle_reset_database called...');

    reset_database(this.db_promise).then(()=>{
      window.location.reload();
    }).catch(error => {
      console.log('handle_reset_database failure...', error);
    });
  }

  //purposefully unregisteres this app's service-worker script
  handle_reset_serviceworker(){
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistration('/').then(registration=>{
        // console.log('sw:',registration);
        registration.unregister().then(is_unregistered=>{
          //success, so refresh window
          if(is_unregistered) window.location.reload();
        }).catch(error=>{
          console.log('unregistration error', error);
        });
      });
    }
  }

  render() {
    return (
      <div className="lotro-app">
        <h1 className='page-title'>[ALPHA] Lord of the Rings Online Character Log [ALPHA]</h1>
        {/* <ReactModal
          className='modal-content'
          overlayClassName='modal'
          isOpen={this.props.update}
          onRequestClose={this.toggle_modal.bind(this)}>
          <Button className='btn' text='Update SW?' onClick={this.props.onUpdateReady}/>
        </ReactModal> */}
        <span style={{display: 'inline-flex', alignItems:'center', height:'42px'}}>
          <h4>Debug Stuff: </h4>
          <Button className='btn btn-danger' text='Reset DB' onClick={this.reset_database_handler} />
          <Button className='btn btn-danger' text='Reset SW' onClick={this.handle_reset_serviceworker} />
        </span>
        <div className='site'>
          <CharacterPanel characters={this.state.characters} selected_character={this.state.selected_character}/>
          <SummaryPanel characters={this.state.characters} selected_character={this.state.selected_character}/>
          <DeedPanel deeds={this.state.deeds} selected_deed={this.state.selected_deed}
            deed_categories={this.state.deed_categories} deed_text={this.state.deed_text}
            characters={this.state.characters} selected_character={this.state.selected_character}
            deed_category_selected={this.state.deed_category_selected}
            deed_subcatetories={this.state.deed_subcategories}
            deed_subcategory_selected={this.state.deed_subcategory_selected}/>
        </div>
      </div>
    );
  }

}

export default LotroApp;
