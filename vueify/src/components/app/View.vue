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
     SOFTWARE.
-->
<template lang="html">
  <div class="lotro-app">
    <div class="title-panel">
      <ul class="title-panel-list">
        <li class="left">
          <h1 class="title">{{title}}</h1>
        </li>
        <li class="right" @click="toggle_menu">
          <h1 class="menu">
            <i class="fa fa-bars" aria-hidden="true"></i>
          </h1>
        </li>
      </ul>
    </div>

    <div class="site">
      <CharactersPanel></CharactersPanel>
      <SummariesPanel></SummariesPanel>
      <DeedsPanel></DeedsPanel>
    </div>

    <Modal
      content_class="modal-content panel"
      overlay_class="modal"
      :is_open="show_menu_modal"
      @request_close="handle_menu_modal_close">
      <div class="about-panel">
        <h3>Miscelaneous Items</h3>

        <div v-if="width >= SCREEN_SIZES.SMALL"
          :style="{display: 'inline-flex', alignItems:'center', height:'42px'}">
          <h4>Debug Commands: </h4>
          <button class="btn btn-danger" @click="handle_reset_database">Reset DB</button>
          <button class="btn btn-danger" @click="handle_reset_serviceworker">Reset SW</button>
        </div>
        <div v-else>
          <h4 :style="{margin:'5px'}">Debug Commands: </h4>
          <button class="btn btn-danger" @click="handle_reset_database">Reset DB</button>
          <button class="btn btn-danger" @click="handle_reset_serviceworker">Reset SW</button>
        </div>

        <div :style="{display: 'inline-flex', alignItems:'center', height:'42px'}">
          <h4>Source Code:</h4>
          <a class="github-link" href="https://github.com/xevrem/lotro-cl">
            <i class="fab fa-github github-icon" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import CharactersPanel from 'components/characters/Panel.vue';
import DeedsPanel from 'components/deeds/Panel.vue';
import SummariesPanel from 'components/summaries/Panel.vue';
import Modal from 'components/ui/Modal.vue';
import {SCREEN_SIZES} from 'utils/constants';

export default {
  data(){
    return {
      title:'LotRO Character Log',
      show_menu_modal: false
    }
  },
  components:{
    CharactersPanel,
    DeedsPanel,
    Modal,
    SummariesPanel
  },
  async mounted(){
    await Promise.all([
      this.fetch_deeds(),
      this.fetch_characters()
    ]);
    console.log('init done');
  },
  computed:{
    ...mapState('utils',[
      'width',
    ]),
    SCREEN_SIZES(){return SCREEN_SIZES}
  },
  methods:{
    ...mapActions('deeds',[
      'fetch_deeds',
    ]),
    ...mapActions('characters',[
      'fetch_characters'
    ]),
    toggle_menu(){this.show_menu_modal = !this.show_menu_modal},
    handle_reset_database(){},
    handle_reset_serviceworker(){},
    handle_show_menu_modal(){},
    handle_menu_modal_close(){this.show_menu_modal = false}
  }
}
</script>

<style lang="scss">
@import 'src/styles/common.scss';

.lotro-app {
  text-align: center;
  color: $fg-color;
}

.title-panel{
  width: 100%;
  background-color: white;
  box-shadow: 0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28);
  padding: 0px;
  margin: 0px 0px 15px 0px;
}

ul.title-panel-list{
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
}

.left{
  float:left;
}

.right{
  float:right;
  cursor: pointer;
}

.title{
  margin: 15px 15px 10px 15px;
}

.menu{
  margin: 15px 15px 10px 15px;
}

li.right:hover{
  background-color: lightgrey;
}

.about-panel{
  text-align: center;
}

.github-link {
  margin: 0px;
  padding: 0px;
  justify-content: center;
  text-decoration: none;
  color: black;
}

.github-icon{
  margin: 5px;
  font-size: 2em;
}

.menu-modal-content{
  padding: 8px 0px;
  margin: 0px;
  position: absolute;
  top: 25%;
  width: 100%;
}

.menu-modal-overlay{
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

@media screen and (min-width: $small) {
  .menu-modal-content{
    width: 500px;
    left: calc((98% - 500px)/2);
  }
}
</style>
