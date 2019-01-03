<!-- Copyright 2018 Erika Jonell

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
SOFTWARE. -->

<template lang="html">
  <div class="container panel deed-panel">
    <h2 class="panel-header">Deed Completion</h2>
    <div class="deed-grid">
      <div class="deed-panel-left nav-grid">
        <div class="nav-left">
          <h3>Category:</h3>
          <div class="deed-nav">
            <button v-for="category in categories"
              :class="category_selected === category ? 'clickable deed-nav-link active': 'clickable deed-nav-link'"
              @click="select_category(category)">
              {{category}}
            </button>
          </div>
        </div>
        <div class="nav-right">
          <h3>Subcategory:</h3>
          <div class="deed-nav">
            <button v-for="subcategory in subcategories"
              :class="subcategory_selected === subcategory ? 'clickable deed-nav-link active' : 'clickable deed-nav-link'"
              @click="select_subcategory(subcategory)">
              {{subcategory}}
            </button>
          </div>
        </div>
      </div>
      <div class="deed-panel-right">
        <h3>Deeds:</h3>
        <div class="deed-list deed-details-grid">
          <Deed v-for="deed in deed_list" :deed="deed"></Deed>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions, mapGetters } from 'vuex';
import Deed from './Deed.vue';

export default {
  components:{
    Deed
  },
  computed:{
    ...mapState('deeds',[
      'categories',
      'subcategories',
      'deed_selected',
      'category_selected',
      'subcategory_selected'
    ]),
    ...mapState('characters',[
      'current_character'
    ]),
    ...mapGetters('deeds',['deed_list'])
  },
  methods:{
    ...mapActions('deeds',['select_category', 'select_subcategory']),
  }
}
</script>

<style lang="scss">
@import 'src/styles/common.scss';

.deed-panel{
  grid-area: deed;
}

.deed-nav{
  // width: auto;
  margin: 5px;
  padding: 0px;
  font-size:  1em;

  display: grid;
  padding: 10px;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  grid-auto-rows: minmax(40px, auto);
  grid-gap: 10px;
}

.deed-nav-link {
  margin: 0px;
  padding: 5px;
  border: none;
  border-radius: 0;
  font-family: lotro;
  font-size: .9em;
  color: $fg-color;
  background-color: $deed-bg;
  box-shadow: 0 0px 2px rgba(127, 127, 127, 1), 0 2px 4px rgba(0,0,0,.12), 0 4px 6px rgba(0,0,0,.24);
}

.deed-nav-link.active{
  box-shadow: 0px 0px 6px rgba(40, 167, 69, 1), 0 2px 8px rgba(19,82,34,.24), 0 4px 10px rgba(19,82,34,.48);
}

.deed-nav-link:hover{
  box-shadow: 0 0px 6px rgba(60, 109, 255,1), 0 2px 8px rgba(30, 54, 127,.24), 0 4px 10px rgba(30, 54, 127,.48);
}

.deed-panel-left{
  grid-area: nav;
}

.deed-panel-right{
  grid-area: details;
  margin: 15px;
}

.nav-left{
  grid-area: nav-cat;
  // border: 1px solid $fg-color;
}

.nav-right{
  grid-area: nav-sub;
  // border: 1px solid $fg-color;
}



@supports (display: grid) {
  @media screen and (min-width: $medium) {

  	.deed-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "nav nav"
        "details details"
		}

    .nav-grid{
      display: grid;
			grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
      grid-template-areas:
        "nav-cat nav-sub"
    }

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
