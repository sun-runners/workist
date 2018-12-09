<template>
  <div id="app" class="b-we w-100vw f-l" style="font-family: 'SF Text', sans-serif;">
    <!-- <header-c></header-c> -->
  </div>
</template>
<script>
import './App.css';
// import HeaderC from './components/header/HeaderC.vue';

var t = window.TrelloPowerUp.iframe();
var months;
t.render(function(){
  t.lists('all')
  .then(function (lists) {
    console.log(lists);
    // for(var i=0; i<lists.length; i++){
    //   var list = lists[i];
    //   if(!list.name) continue;
    // }
  });
});

export default {
  name: 'app',
  extends: {},
  props: {},
  components: {
    // 'header-c': HeaderC,
  },
  data: function(){
  },
  computed: {
  },
  watch: {},
  methods: {},
  beforeCreate(){},
  mounted(){}
}
</script>
