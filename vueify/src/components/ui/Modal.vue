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
  <div v-if="show" :class="overlay_class" @click="handle_click">
    <div :class="content_class">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props:['content_class', 'overlay_class', 'is_open'],
  computed:{
    show(){
      return !this.is_open ? false : this.is_open;
    }
  },
  methods:{
    handle_click(event){
      if(event.target.className !== this.overlay_class) return;
      this.$emit('request_close')
    }
  }
}
</script>

<style lang="scss">
</style>
