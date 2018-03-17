import React, { Component } from 'react';
import './LotroApp.css';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';
import SummaryPanel from './SummaryPanel';

import {create_store, get_store} from './../Store';
import {ACTION_TYPES, DEED_CATEGORIES} from './../constants';
import {open_database, initial_deed_population, get_deeds_of_type, save_characters} from './../database';
import { Button, Modal } from './Common';

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
  completed:[false,false,false]
};

//create a store, update interval 16ms, dispatch all queued
create_store(initial_state, 16, -1);

class LotroApp extends Component {
  constructor(props){
    super(props);
    this.state = get_store().get_state();
    this.db_promise = open_database();
  }

  componentDidMount(){
    console.log('mounted...')
    get_store().subscribe(ACTION_TYPES.CHARACTER_ADDED, this.handle_character_action.bind(this));
    get_store().subscribe(ACTION_TYPES.CHARACTER_SELECTED, this.handle_character_action.bind(this));
    get_store().subscribe(ACTION_TYPES.CHARACTER_UPDATED, this.handle_character_action.bind(this))
    get_store().subscribe(ACTION_TYPES.DEED_SELECTED, this.handle_deed_action.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_COMPLETED, this.handle_deed_action.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_UPDATE, this.handle_deed_action.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_CATEGORY_CHANGED, this.handle_deed_category_changed.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_SUBCATEGORY_CHANGED, this.handle_subcategory_changed.bind(this));
    get_store().subscribe('initialization', this.handle_initialization.bind(this));

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
            resolve(fetch('/data/characters.json').then(resp=>{
              return resp.json();
            }));
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
      })

      get_store().issue_action('initialization', {
        characters: data[0],
        deeds: data[1],
        deed_subcategories: categories
      })
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

  handle_deed_category_changed(state, data){
    console.log('handle_deed_category_changed called...', data);
    this.setState(data);

    //FIXME: this may be fixed later on, but for now switch is needed for development
    switch(data.deed_category_selected){
      case DEED_CATEGORIES.CLASS://change to class deeds
        get_deeds_of_type(this.db_promise, DEED_CATEGORIES.CLASS).then(data=>{
          //create the subcategories
          let subs = new Set();

          data.forEach(deed=>{
            subs.add(deed.Subcategory);
          })

          get_store().issue_action(ACTION_TYPES.DEED_UPDATE, {
            deeds:data,
            deed_subcategories:subs,
            deed_subcategory_selected: ''
          });
        });
        break;
      case DEED_CATEGORIES.ERIADOR://change to Eriador deeds
        get_deeds_of_type(this.db_promise, DEED_CATEGORIES.ERIADOR).then(data=>{
          //create the subcategories
          let subs = new Set();

          data.forEach(deed=>{
            subs.add(deed.Subcategory);
          })

          //issue deed upate
          get_store().issue_action(ACTION_TYPES.DEED_UPDATE, {
            deeds:data,
            deed_subcategories:subs,
            deed_subcategory_selected: ''
          });
        });
        break;
      default:
        break;
    }
  }

  handle_subcategory_changed(state, data){
    console.log('handle_subcategory_changed called...');
    this.setState(data);
  }

  toggle_modal(event){
    console.log('toggle_modal called...')
  }

  render() {
    return (
      <div className="lotro-app">
        <h1 className='page-title'>Lotro Character Log</h1>
        <Modal className='modal' contentClassName='modal-content' is_visible={this.props.update} onFocusLoss={this.toggle_modal.bind(this)}>
          <Button className='btn' text='Update SW?' onClick={this.props.onUpdateReady}/>
        </Modal>
        <CharacterPanel characters={this.state.characters} selected_character={this.state.selected_character}/>
        <SummaryPanel character={this.state.characters ? this.state.characters[this.state.selected_character]:null}/>
        <DeedPanel deeds={this.state.deeds} selected_deed={this.state.selected_deed}
          deed_categories={this.state.deed_categories} deed_text={this.state.deed_text} completed={this.state.completed}
          deed_category_selected={this.state.deed_category_selected}
          deed_subcatetories={this.state.deed_subcategories}
          deed_subcategory_selected={this.state.deed_subcategory_selected}/>
      </div>
    );
  }

}

export default LotroApp;
