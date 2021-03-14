<template>
  <header id="header" cu-state="normal">
    <nav>
      <ul id="gnb">
        <li class="top-menu"  v-for="(menu) in userAuthMenuList" :key="menu.menuNm"><a href="#">{{menu.menuNm}}</a></li>
      </ul>
    </nav>
  </header>
</template>
<script>
import store from "$store";
export default {
name: "menubar",
  computed:{
    userAuthMenuList() {
      return store.state.userAuthMenuList
    }
  },
  methods:{
  // addTask(){
  //
  // }
  }
}
</script>

<style scoped>

.gnb {-ms-user-select: none; -moz-user-select: -moz-none; -webkit-user-select: none; -khtml-user-select: none; user-select:none;}
.function {-ms-user-select: none; -moz-user-select: -moz-none; -webkit-user-select: none; -khtml-user-select: none; user-select:none;}


.gnb > li{
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  margin-left: 0;
}
@media all and (min-width:1280px){
  .gnb > li{
    border-left: 1.15vw solid transparent;
    border-right: 1.15vw solid transparent;
    margin-left:0;
  }
}

</style>
