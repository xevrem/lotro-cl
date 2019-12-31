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
import React, { Component } from 'react';
import ReactModal from 'react-modal';
import './LotroApp.scss';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';
import SummaryPanel from './SummaryPanel';

import {create_store, get_store} from './../Store';
import {ACTION_TYPES, DEED_CATEGORIES, BASE_URL, SCREEN_SIZES} from './../constants';
import {open_database, initial_deed_population, get_deeds_of_type, save_characters, reset_database} from './../database';
import { Button } from './Common';

ReactModal.setAppElement('#root');

let initial_state = {
  selected_character:-1,
  selected_deed:-1,
  deed_category_selected: 0,
  deed_subcategory_selected: '',
  deed_subcategories: null,
  characters: [],
  deeds: [],
  deed_categories: Object.keys(DEED_CATEGORIES),
  width: window.innerWidth,
  height: window.innerHeight,
  show_menu_modal: false
};

//create a store, update interval 16ms, dispatch all queued
create_store(initial_state, 16, -1);

//update window resizing information in store
const update_window_dimensions = event => {
  get_store().issue_action(ACTION_TYPES.WINDOW_RESIZE, { width: window.innerWidth, height: window.innerHeight });
}
//ensure window resizing is captured
window.addEventListener('resize', update_window_dimensions);


class LotroApp extends Component {
  constructor(props){
    super(props);
    this.state = get_store().get_state();
    this.db_promise = open_database();

    this.handle_reset_database = this.handle_reset_database.bind(this);
    this.handle_menu_modal_close = this.handle_menu_modal_close.bind(this);
    this.handle_show_menu_modal = this.handle_show_menu_modal.bind(this);

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
    get_store().subscribe(ACTION_TYPES.MENU_UPDATE, this.handle_menu_update.bind(this));

    get_store().subscribe(ACTION_TYPES.WINDOW_RESIZE, this.handle_window_resize.bind(this));
  }

  componentDidMount(){
    // console.log('mounted...')

    initial_deed_population(this.db_promise).then(()=>{
      this.retrieve_app_data();
    })
  }

  retrieve_app_data(){
    // console.log('retrieve_app_data called...');

    //get stored character data
    let character_data = new Promise((resolve,reject)=>{
      //attempt to pull data from the db, otherwise fetch
      this.db_promise.then(db=>{
        let tx = db.transaction('characters');
        tx.objectStore('characters').getAll().then(data=>{
          if(data.length>0){
            resolve(data);
          }else{
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
    // console.log('handle_initialization called...');
    this.setState(data);
  }

  handle_character_action(state, data){
    // console.log('handle_character_action called...');
    this.setState(data);

    //save character data into db
    save_characters(this.db_promise, state.characters);
  }

  handle_deed_action(stat, data){
    // console.log('handle_deed_action called...');
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
    // console.log('handle_deed_category_changed called...', data);
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

      case DEED_CATEGORIES["INSTANCES SHADOWS OF ANGMAR"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES MINES OF MORIA"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES LOTHLORIEN"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES MIRKWOOD"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES IN THEIR ABSENCE"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES RISE OF ISENGUARD"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES ROAD TO EREBOR"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES ASHES OF OSGILIATH"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["INSTANCES BATTLE OF PELENNOR"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES["SOCIAL, EVENTS, AND HOBBIES"]:
        this.switch_deed_category(this.db_promise, data);
        break;
      case DEED_CATEGORIES.SPECIAL:
        this.switch_deed_category(this.db_promise, data);
        break;
      default:
        break;
    }
  }

  handle_subcategory_changed(state, data){
    // console.log('handle_subcategory_changed called...');
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
      navigator.serviceWorker.getRegistration(BASE_URL+'/').then(registration=>{

        //tell service_worker to cleanup its cache
        if(registration) registration.active.postMessage({action: 'CLEANUP'});

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

  handle_menu_update(state, data){
    // console.log('handle_menu_update called...');
    this.setState(data);
  }

  handle_menu_modal_close(){
    // console.log('handle_menu_modal_close called...')
    get_store().issue_action(ACTION_TYPES.MENU_UPDATE, {show_menu_modal:false});
  }

  handle_show_menu_modal(){
    // console.log('handle_show_menu_modal called...')
    get_store().issue_action(ACTION_TYPES.MENU_UPDATE, {show_menu_modal:true});
  }

  handle_window_resize(state, data){
    // console.log('handle_show_menu_modal called...')
    this.setState(data);
  }


  render() {
    //adjust title depending on screen width
    let title = "LoTRO CL"

    if(this.state.width > SCREEN_SIZES.SMALL){
      title = "LoTRO Character Log";
    }
    //width is larger than the below full string at h1
    if(this.state.width > 873){
      title = "Lord of the Rings Online Character Log";
    }

    return (
      <div className="lotro-app">
        <div className='title-panel'>

          <ul className='title-panel-list'>
            <li className='left'>
              <h1 className='title'>{title}</h1>
            </li>
            <li className='right' onClick={this.handle_show_menu_modal}>
              <h1 className='menu' onClick={this.handle_show_menu_modal}><i className="fa fa-bars" aria-hidden="true"></i></h1>
            </li>
          </ul>


          <ReactModal
            className="menu-modal-content panel"
            overlayClassName="menu-modal-overlay"
            isOpen={this.state.show_menu_modal}
            onRequestClose={this.handle_menu_modal_close}>
            <div className="about-panel">
              <h3>Miscelaneous Items</h3>

              {this.state.width >= SCREEN_SIZES.SMALL ? (
                <div style={{display: 'inline-flex', alignItems:'center', height:'42px'}}>
                  <h4>Debug Commands: </h4>
                  <Button className='btn btn-danger' text='Reset DB' onClick={this.handle_reset_database} />
                  <Button className='btn btn-danger' text='Reset SW' onClick={this.handle_reset_serviceworker} />
                </div>
              ):(
                <div>
                  <h4 style={{margin:'5px'}}>Debug Commands: </h4>
                  <Button className='btn btn-danger' text='Reset DB' onClick={this.handle_reset_database} />
                  <Button className='btn btn-danger' text='Reset SW' onClick={this.handle_reset_serviceworker} />
                </div>
              )}

              <div style={{display: 'inline-flex', alignItems:'center', height:'42px'}}>
                <h4>Source Code:</h4>
                <a className='github-link' href="https://github.com/xevrem/lotro-cl">
                  <i className="fab fa-github github-icon" aria-hidden="true"></i>
                </a>
              </div>

            </div>
          </ReactModal>
        </div>

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
