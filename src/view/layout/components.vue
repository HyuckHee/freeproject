<template>
  <div>
    <transition name="fade" mode="out-in"><reduceTest>></reduceTest></transition>
    <transition name="fade" mode="out-in"><pokemonGo>></pokemonGo></transition>

  </div>
</template>

<script>
// import store from '$store'

export default {
name: "components",
  data() {
    return {
      taskList:[]
      ,currTask:""
      ,currTaskName:""

      ,isTeemo:true
    }
  },
  components : {
    reduceTest : () => import('@/view/components/reduce/reduceTest'),
    pokemonGo : () => import('@/view/components/pokemonGo/pokemonGo')
  },
  created:function(){
  },
  mounted(){
  },
  // computed:{
  // menuList() {
  //   return store.state.menuList;
  // }
  // },
  methods : {
    // isCurrTask(taskName){
    //   let isExist = false;
    //   for(var idx in this.menuList){
    //     if(this.menuList[idx]['task'] == taskName){
    //       isExist = true;
    //     }
    //   }
    //
    //   return isExist;
    // }

  }
}
</script>

<style scoped>

</style>
