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
  <div class="panel character-panel">
    <h2 class="panel-header">Characters</h2>
    <div class="character-grid">
      <div class="character-actions">
        <h4>Actions:</h4>
        <button class="btn btn-primary" @click="handle_add_character">Add Character</button>
        <button class="btn btn-success" @click="handle_save_all">Save All Characters</button>
        <button class="btn btn-danger" @click="handle_delete_character">Delete Selected</button>
        <button class="btn btn-primary" @click="handle_upload_character_clicked">Upload Characters</button>
        <button class="btn btn-primary"@click="handle_download_characters">Download Characters</button>
      </div>
      <div class="character-area">
        <h4>Characters:</h4>
        <ul class="character-list">
          <li v-for="character in characters" class="character-list-item" />
            <Character :character="character" :selected="character === character_selected"></Character>
          </li>
        </ul>
      </div>
      <Modal
        content_class="modal-content panel"
        overlay_class="modal"
        :is_open="show_upload_modal"
        @request_close="handle_modal_request_close">
        <!-- FIXME: move this form's style into character panel's scss file -->
        <form @submit.prevent="handle_submit">
          <h3 :style="{textAlign:'center', marginTop:'0px'}" >Select File to Load</h3>
          <div :style="{display:'inline-flex', alignItems:'center'}">
            <label class='modal-load-label btn'>
              Browse...
              <input type="file" @change="handle_file_input_change" />
            </label>
            <p :style="{fontFamily:'sans-serif', margin:'5px'}">File: {{filename}}</p>
          </div>
          <button type="submit" class='btn btn-primary'>Load File</button>
        </form>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Modal from 'components/ui/Modal.vue';
import Character from './Character.vue';

export default {
  data(){
    return {
      show_upload_modal: false,
      filename:'characters.json'
    }
  },
  components:{
    Character,
    Modal
  },
  computed:{
    ...mapState('characters', [
      'characters',
      'character_selected'
    ])
  },
  methods:{
    handle_add_character(){console.info('handle_add_character()')},
    handle_save_all(){},
    handle_delete_character(){},
    handle_upload_character_clicked(){this.show_upload_modal = true},
    handle_download_characters(){},
    handle_modal_request_close(){this.show_upload_modal = false},
    handle_file_input_change(){
      //get the name of the selected file and
      let input = document.querySelector('#file-load');
      this.setState({filename:input.files[0].name});
    },
    handle_submit(){this.show_upload_modal = false;}
  }
}
</script>

<style lang="scss">
@import 'src/styles/common.scss';

.character-panel{
  grid-area: character;
}

.character-actions{
  display: block;
}

.character-list{
  padding: 0px;
}

.character-list-item {
  list-style: none;
  margin: 5px;
  display: inline-flex;
}

</style>
