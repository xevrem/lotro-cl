
const RACES = {
  NONE:{id:'NONE', text:''},
  BEORNING: {id:'BEORNING', text:'Beorning'},
  DWARF: {id:'DWARF',text:'Dwarf'},
  HIGH_ELF:{id:'HIGH_ELF',text:'High Elf'},
  HOBBIT:{id:'HOBBIT', text:'Hobbit'},
  HUMAN:{id:'HUMAN',text:'Human'},
  ELF: {id:'ELF', text:'Elf'},
}

const CLASSES = {
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
}

const ACTION_TYPES = {
  CHARACTER_ADDED:'CHARACTER_ADDED',
  CHARACTER_SELECTED: 'CHARACTER_SELECTED',
  CHARACTER_UPDATED:'CHARACTER_UPDATE',
  DEED_UPDATE: 'DEED_UPDATE',
  DEED_SELECTED: 'DEED_SELECTED',
  DEED_COMPLETED: 'DEED_COMPLETED',
  DEED_CATEGORY_CHANGED: 'DEED_CATEGORY_CHANGED',
  DEED_SUBCATEGORY_CHANGED: 'DEED_SUBCATEGORY_CHANGED'
}

const DEED_CATEGORIES = {
  CLASS:0,
  RACE:1,
  EPIC:2,
  REPUTATION:3,
  ERIADOR:4,
  RHOVANION:5,
  GONDOR:6,
  MORDOR:7,
  SKIRMISH:8,
  INSTANCES:9,
  HOBBIES:10
}

export {RACES, CLASSES, ACTION_TYPES, DEED_CATEGORIES};
