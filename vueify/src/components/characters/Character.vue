<template lang="html">
  <div :class="selected ? 'character selected':'character'">
    <form class="character-form">
      <label class="character-form-label">
        Name:
        <input type="text" class="character-form-item" name="character-name" :value="character.name" @change="handle_change">
      </label>
      <label class="character-form-label">
        Race:
        <select class="character-form-item" name="character-race" :value="character.race" @change="handle_change">
          <option v-for="race in RACES" :key="race.id" :value="race.text">{{race.text}}</option>
        </select>
      </label>
      <label class="character-form-label">
        Class:
        <select class="character-form-item" name="character-class" :value="character.class" @change="handle_change">
          <option v-for="cclass in CLASSES" :key="cclass.id" :value="cclass.text">{{cclass.text}}</option>
        </select>
      </label>
      <label class="character-form-label">
        Level:
        <input type="text" class="character-form-item" name="character-level" :value="character.level" @change="handle_change">
      </label>
      <button class="btn btn-primary character-form-item" @click.prevent="handle_selected">Select</button>
    </form>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import { RACES, CLASSES } from 'utils/constants';

export default {
  props:['character', 'selected'],
  computed:{
    RACES(){return RACES},
    CLASSES(){return CLASSES}
  },
  methods:{
    ...mapActions('characters',['select_character']),
    handle_selected(){
      console.info('handle_selected()')
      this.select_character(this.character.name);
    },
    handle_change(){console.info('handle_change()')}
  }
}
</script>

<style lang="scss" scoped>
@import 'src/styles/common.scss';

.character {
  margin: 5px;
  padding: 5px;
  width: 250px;
  box-shadow: 0 0px 2px rgba(127, 127, 127, 1), 0 2px 4px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.24);
}

.character.selected{
  box-shadow: 0px 0px 6px rgba(40, 167, 69, 1), 0 2px 8px rgba(19,82,34,.24), 0 4px 10px rgba(19,82,34,.48);
}

.character-form{
  display: flex;
  flex-direction: column;
  padding: 5px;
  margin: 0px auto;
  width: 200px;
}

.character-form-label{
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 5px;
  margin: 0px;
}

.character-form-item{
  width: 120px;
  padding: 5px;
  margin: 5px auto;
  border: none;
  border-bottom: 2px solid $shadow;
}

select.character-form-item{
  width: 132px;
}

button.character-form-item{
  margin: auto;
}


</style>
