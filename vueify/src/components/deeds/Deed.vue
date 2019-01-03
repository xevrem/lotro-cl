<template lang="html">
  <div :class="is_selected ? 'deed clickable selected' : 'deed clickable'"
    @click="select_deed(deed)">
    {{deed.Deed}}
    <div v-if="is_selected" class="">
      hihihi
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  props:['deed'],
  computed:{
    ...mapState('deeds',['deed_selected']),
    is_selected(){ return this.deed.Deed === this.deed_selected }
  },
  methods:{
    ...mapActions('deeds',['select_deed'])
  }
}
</script>

<style lang="scss">
@import 'src/styles/common';

.deed{
  margin-bottom: 10px;
  padding: 10px;

  background-color: rgb(247, 226, 181);
  box-shadow: 0 0px 2px rgba(127, 127, 127, 1), 0 2px 4px rgba(0,0,0,.12), 0 4px 6px rgba(0,0,0,.24);
}

.deed:hover{
  box-shadow: 0 0px 6px rgba(60, 109, 255,1), 0 2px 8px rgba(30, 54, 127,.24), 0 4px 10px rgba(30, 54, 127,.48);
}

.deed.selected{
  box-shadow: 0px 0px 6px rgba(40, 167, 69, 1), 0 2px 8px rgba(19,82,34,.24), 0 4px 10px rgba(19,82,34,.48);
}

.deed-details{
  margin: 0px;
  padding: 5px;
  background-color: rgb(247, 226, 181);
  text-align: left;
  box-shadow:  0 0 2px rgba(127, 127, 127, 1), 0 2px 4px rgba(0, 0, 0, .12), 0 4px 6px rgba(0, 0, 0, .24);
  grid-area: deed-details;
}

.deed-details.completed{
  // border: 2px solid #28a745;
  box-shadow: 0 0 6px rgba(40, 167, 69, 1), 0 2px 8px rgba(19,82,34,.24), 0 4px 10px rgba(19,82,34,.48);
}

.deed-stats{
  display: inline-flex;
  margin: 5px;
  padding: 5px 10px;
  box-shadow: 0px 0px 2px $deed-fg;
}

.deed-list{
  padding:0px;
  margin: 0px;
  grid-area: deed-list;
}

.deed-list-item{
  list-style: none;
}

.deed-completed-btn{
  display: block;
  bottom: 7px;
}

.completed{
  // border: 2px solid #28a745;
  box-shadow: 0 0 6px rgba(40, 167, 69, 1), 0 2px 8px rgba(19,82,34,.24), 0 4px 10px rgba(19,82,34,.48);
  background-color: rgb(228, 247, 182);
}

@supports (display: grid) {
  @media screen and (min-width: $medium) {

    .deed{
      margin-bottom: 0px;
    }

    .deed-details-grid{
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
      grid-gap:10px;
    }
	}

  @media screen and (min-width: $large){
    .deed{
      margin-bottom: 0px;
    }

    .deed-details-grid{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto;
      grid-gap:10px;
    }
  }
}
</style>
