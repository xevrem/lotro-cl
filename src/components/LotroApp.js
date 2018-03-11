import React, { Component } from 'react';
import './LotroApp.css';

import CharacterPanel from './CharacterPanel';
import DeedPanel from './DeedPanel';
import SummaryPanel from './SummaryPanel';

import {create_store, get_store} from './../Store';
import {ACTION_TYPES, DEED_TYPES} from './../constants';
import {open_database, initial_deed_population, load_deeds_from_db} from './../database';
import { Button } from './Common';

//import characters from '../data/characters.json';
//import eriador from '../data/eriador.json';

let initial_state = {
  selected_character:0,
  selected_deed:0,
  deed_nav_selected: 0,
  characters: null,
  deeds: ['Totam vero officia dolorum iure minus nisi',
      'nostrum provident reiciendis laudantium voluptatibus',
      'expedita laborum recusandae quasi esse sit enim suscipit'],
  deed_types:['Class','Race','Epic','Reputation','Eriador', 'Rhovanion',
       'Gondor', 'Mordor', 'Skirmish', 'Instances', 'Hobbies'],
  deed_text:['Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam vero officia dolorum iure minus nisi, nostrum provident reiciendis laudantium voluptatibus expedita laborum recusandae quasi esse sit enim suscipit mollitia odio?',
      'nostrum provident reiciendis laudantium voluptatibus expedita laborum recusandae quasi esse sit enim suscipit mollitia odio? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam vero officia dolorum iure minus nisi,',
      'voluptatibus expedita laborum recusandae quasi esse sit enim suscipit mollitia odio? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam vero officia dolorum iure minus nisi, nostrum provident reiciendis laudantium'],
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
    get_store().subscribe(ACTION_TYPES.CHARACTER_ADDED, this.handle_character_added.bind(this));
    get_store().subscribe(ACTION_TYPES.CHARACTER_SELECTED, this.handle_character_selected.bind(this));
    get_store().subscribe(ACTION_TYPES.CHARACTER_UPDATED, this.handle_character_update.bind(this))
    get_store().subscribe(ACTION_TYPES.DEED_SELECTED, this.handle_deed_selected.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_COMPLETED, this.handle_deed_completed.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_NAV_CHANGED, this.handle_deed_nav_changed.bind(this));
    get_store().subscribe(ACTION_TYPES.DEED_UPDATE, this.handle_deed_update.bind(this));
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
      })
    });

    //do initial class deed data load
    let class_data = new Promise((resolve,reject)=>{
      this.db_promise.then(db=>{
        db.transaction('deeds').objectStore('deeds').get(DEED_TYPES.CLASS).then(data=>{
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
        subcategories: categories
      })
    }).catch(error=>{
      console.log('retrieve_app_data error:',error);
    })
  }  

  handle_initialization(state, data){
    console.log('handle_initialization called...', data);
    this.setState(data);
  }

  handle_character_added(state, data){
    console.log('handle_character_added called...', data);
    this.setState(data);
  }

  handle_character_selected(state, data){
    console.log('handle_character_selected called...', data);
    this.setState(data)
  }

  handle_character_update(state, data){
    console.log('handle_character_update called...', data);
    this.setState(data);
  }

  handle_deed_selected(state, data){
    console.log('handle_deed_selected called...', data);
    this.setState(data)
  }

  handle_deed_completed(state, data){
    console.log('handle_deed_completed called...', data);
    this.setState(data)
  }

  handle_deed_nav_changed(state, data){
    console.log('handle_deed_nav_changed called...', data);
    this.setState(data);
    
    //FIXME: this can be fixed later on, but for now switch is needed for development
    switch(data.deed_nav_selected){
      case DEED_TYPES.CLASS://change to class deeds
        load_deeds_from_db(this.db_promise, DEED_TYPES.CLASS).then(data=>{
          //create the subcategories
          let subs = new Set();
          
          data.forEach(deed=>{
            subs.add(deed.Subcategory);
          })

          get_store().issue_action(ACTION_TYPES.DEED_UPDATE, {deeds:data, subcategories:subs});
        });
        break;
      case DEED_TYPES.ERIADOR://change to Eriador deeds
        load_deeds_from_db(this.db_promise, DEED_TYPES.ERIADOR).then(data=>{
          //create the subcategories
          let subs = new Set();
          
          data.forEach(deed=>{
            subs.add(deed.Subcategory);
          })

          //issue deed upate
          get_store().issue_action(ACTION_TYPES.DEED_UPDATE, {deeds:data, subcategories:subs});
        });
        break;
      default:
        break;
    }
  }

  handle_deed_update(state, data){
    console.log('handle_deed_update called...', data);
    this.setState(data);
  }

  render() {
    return (
      <div className="lotro-app">
        <h1 className='page-title'>Lotro Character Log</h1>
        {this.props.update && <Button className='btn' text='Update Services?' onClick={()=>{
          //tell service worker to take over now
          this.props.worker.postMessage({action: 'SKIP_WAITING'})}
        }/>}
        <CharacterPanel characters={this.state.characters} selected_character={this.state.selected_character}/>
        <SummaryPanel />
        <DeedPanel  deeds={this.state.deeds} selected_deed={this.state.selected_deed}
          deed_types={this.state.deed_types} deed_text={this.state.deed_text} completed={this.state.completed}
          deed_nav_selected={this.state.deed_nav_selected}
          deed_subcategories={this.state.subcategories}
          deed_subcategory_selected={0}/>
      </div>
    );
  }

}

export default LotroApp;
