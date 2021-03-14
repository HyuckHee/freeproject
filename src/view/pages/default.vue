<template>
  <div id="wrap">
    <menubar></menubar>
    <components></components>
  </div>
</template>

<script>
import store from '$store'

export default {
  name: 'default',
  components : {
    'components' : () => import('@/view/layout/components'),
    'menubar' : () => import('@/view/layout/menubar')
  },
  data() {
    return {
    }
  },
  mounted() {
    store.state.userAuthMenuList = [{menuCd: 1, menuNm: 'reduce'},{menuCd: 2, menuNm: 'grid'},{menuCd: 3, menuNm: 'pokemonGo'}]
    //메뉴 목록
  },
  // methods: {
  //   created() {
  //   }
  //   }
}
</script>

<style scoped>

</style>
