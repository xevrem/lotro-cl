import Vue from 'vue';


// function Button(props){
//   return(
//     <button className={props.className} onClick={props.onClick}>
//       {props.text}
//     </button>
//   );
// }
export const LButton = {
  functional: true,
  render(createElement, { data, children }) {
    return createElement( 'button', data, children );
  }
};


// function TextInput(props){
//   return(
//     <div className={props.div_class}>
//       <label className={props.label_class} htmlFor={props.id}>{props.label}</label>
//       <input className={props.className} type='text' id={props.id} value={props.value} onChange={props.onChange} name={props.name} placeholder={props.placeholder} />
//     </div>
//   );
// }
export const LTextInput = Vue.component('l-tetxt-input',{

});


// function SelectObject(props){
//   let key_list = Object.keys(props.object);
//   let options = key_list.map((key, i)=>{
//     let item = props.object[key];
//     return <option key={i} value={item.id}>{item.text}</option>
//   })
//
//   return(
//     <div className={props.div_class}>
//       <label className={props.label_class} htmlFor={props.id}>{props.label}</label>
//       <select className={props.className} name={props.name} value={props.default} onChange={props.onChange}>
//         {options}
//       </select>
//     </div>
//   );
// }
export const LSelect = Vue.component('l-select', {
  props:['object', 'label', 'label_class', 'select_class', "select_name", 'value', 'change'],
  template:`
    <label class="label_class">
      {{label}}
      <select class="select_class" name="select_name" value="value" @change="change">
        <option v-for="obj in object" :key="obj.id" value="obj.id">{{obj.text}}</option>
      </select>
    </label>
  `
});
