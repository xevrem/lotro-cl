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
  <div class='container panel summary-panel'>
    <h2 class='panel-header'>Summary for {character.name}</h2>
    <div class='summary-details'>
      <p style="{display:'inline-flex'}">Deeds: </p>
      <p class='summary-stat'>Total: {total_deeds}</p>
      <p class='summary-stat'>Total Complete: {total_deeds_complete}</p>
      <p class='summary-stat'>Percent Complete: {percent_deeds}%</p>
    </div>
    <div class='summary-details'>
      <p style="{display:'inline-flex'}">Quests: </p>
      <p class='summary-stat'>Total: {total_quests}</p>
      <p class='summary-stat'>Total Complete: {total_quests_complete}</p>
      <p class='summary-stat'>Percent Complete: {percent_quests}%</p>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  computed:{
    ...mapState('characters', [
      'characters',
      'selected_character'
    ])
  }
}
</script>

<style lang="scss">
@import 'src/styles/common.scss';

.summary-panel{
  grid-area: summary;
}

.summary-details{
  // float:left;
  margin: 5px;
  padding: 5px;
  // border-radius: 5px;
  // border: 2px solid rgb(143, 118, 65);
  background-color: rgb(247, 226, 181);
  text-align: left;
  box-shadow:  0 0 2px rgba(127, 127, 127, 1), 0 2px 4px rgba(0, 0, 0, .12), 0 4px 6px rgba(0, 0, 0, .24);
}

.summary-stat{
display: inline-flex;
margin: 5px;
padding: 5px 10px;
box-shadow: 0px 0px 2px $deed-fg;
}

</style>
