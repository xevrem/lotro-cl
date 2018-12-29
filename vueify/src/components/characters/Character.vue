<template lang="html">
  <div className={props.selected ? "character selected":"character"}>
    <label class="character-label">
      Name: <input type="text" class="character-form" name="character-name" value="name" @change="handle_change">
    </label>
    <LSelect />
    <SelectObject div_class="character-form-div" class="character-form" label_class="character-label"
      name="character-race" object={RACES} default={props.race} label="Race: " onChange={props.onChange}/>
    <SelectObject div_class="character-form-div" class="character-form" label_class="character-label"
      name="character-class" object={CLASSES} default={props.class} label="Class: " onChange={props.onChange}/>
    <TextInput div_class="character-form-div" class="character-form" label_class="character-label"
      name="character-level" value={props.level} label="Level: " onChange={props.onChange}/>
    <div className="character-form-div">
      <button class="btn btn-primary character-form" @click="handle_selected">Select</button>
    </div>
  </div>
}
</template>

<script>
import { LSelect } from 'components/ui/common';
import { RACES, CLASSES } from 'utils/constants';

export default {
  props:['name'],
  components:{
    LSelect
  },
  computed:{

  },
  methods:{
    handle_selected(){},
    handle_change(){}
  }
}
</script>

<style lang="css" scoped>
</style>
