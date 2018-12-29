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

/* global process */

export const RACES = {
  NONE:{id:'NONE', text:''},
  BEORNING: {id:'BEORNING', text:'Beorning'},
  DWARF: {id:'DWARF',text:'Dwarf'},
  HIGH_ELF:{id:'HIGH_ELF',text:'High Elf'},
  HOBBIT:{id:'HOBBIT', text:'Hobbit'},
  HUMAN:{id:'HUMAN',text:'Human'},
  ELF: {id:'ELF', text:'Elf'},
};

export const CLASSES = {
  NONE:{id:'NONE', text:''},
  BEORNING: {id:'BEORNING', text:'Beorning'},
  BURGLAR:{id:'BURGLAR', text:'Burglar'},
  CAPTAIN:{id:'CAPTAIN', text: 'Captain'},
  CHAMPION:{id:'CHAMPION', text:'Champion'},
  GUARDIAN:{id:'GUARDIAN', text:'Guardian'},
  HUNTER:{id:'HUNTER', text:'Hunter'},
  LORE_MASTER:{id:'LORE_MASTER', text:'Lore-master'},
  MINSTREL:{id:'MINSTREL', text:'Minstrel'},
  RUNE_KEEPER:{id:'RUNE_KEEPER', text:'Rune-keeper'},
  WARDEN:{id:'WARDEN', text:'Warden'}
};

export const ACTION_TYPES = {
  CHARACTER_ADDED:'CHARACTER_ADDED',
  CHARACTER_SELECTED: 'CHARACTER_SELECTED',
  CHARACTER_UPDATED:'CHARACTER_UPDATED',
  CHARACTER_DELETED:'CHARACTER_DELETED',
  DEED_UPDATED: 'DEED_UPDATED',
  DEED_SELECTED: 'DEED_SELECTED',
  DEED_COMPLETED: 'DEED_COMPLETED',
  DEED_CATEGORY_CHANGED: 'DEED_CATEGORY_CHANGED',
  DEED_SUBCATEGORY_CHANGED: 'DEED_SUBCATEGORY_CHANGED',
  INITIALIZATION: 'INITIALIZATION',
  INITIALIZATION_DONE: 'INITIALIZATION_DONE',
  WINDOW_RESIZE: 'WINDOW_RESIZE',
  MENU_UPDATE: 'MENU_UPDATE',
};

export const DEED_CATEGORIES = {
  CLASS:0,
  RACE:1,
  'SHADOWS OF ANGMAR':2,
  'THE MINES OF MORIA':3,
  'ALLIES TO THE KING':4,
  'THE STRENGTH OF SAURON':5,
  'THE BLACK BOOK OF MORDOR':6,
  REPUTATION:7,
  ERIADOR:8,
  RHOVANION:9,
  GONDOR:10,
  MORDOR:11,
  SKIRMISH:12,
  'INSTANCES SHADOWS OF ANGMAR':13,
  'INSTANCES MINES OF MORIA':14,
  'INSTANCES LOTHLORIEN':15,
  'INSTANCES MIRKWOOD':16,
  'INSTANCES IN THEIR ABSENCE':17,
  'INSTANCES RISE OF ISENGUARD':18,
  'INSTANCES ROAD TO EREBOR':19,
  'INSTANCES ASHES OF OSGILIATH':20,
  'INSTANCES BATTLE OF PELENNOR':21,
  'SOCIAL, EVENTS, AND HOBBIES':22,
  SPECIAL:23
};

export const SCREEN_SIZES = {
  SMALL: 576,
  MEDIUM: 768,
  LARGE: 1024,
  XLARGE: 1200
};



// export {RACES, CLASSES, ACTION_TYPES, DEED_CATEGORIES, SCREEN_SIZES, BASE_URL};
