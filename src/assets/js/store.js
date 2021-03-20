/**
 * Created by crony on 2017-04-28.
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
      ssUserId:'', //사용자아이디!!
      ssUserName:'', //사용자명
      ssUserLang:'', //언어코드
      ssUserAreaCd:'', //사용자기본 구역
      ssUserAreaName:'', //사용자구역명
      ssUserMainMenuCd:'', //사용자초기메뉴코드
      userMainMenuUrl:'', //사용자초기메뉴URL
      userMainMenuNm:'', //사용자초기메뉴명
      userAuthMenuList:[], //사용자메뉴리스트
      userFavoritList:[], //사용자즐겨찾기목록
      siteAreaList:[], //사이트 구역정보
      weatherInfo:{}, //기상정보
      serverTimeInfo:{}, //서버시간(실시간아님)
      favoriteYn:'N', //즐겨찾기여부
      currTask: '', //현재창 ID
      menuNavigate:[], //메뉴 네비게이션
      menuList: [], //TaskList(현재열려있는 창)
      multipleCorrelateList: [] , // 다중상관 분석 목록
      correlateSeq: '',           // 다중상관 분석 Seq

      // 사용자 로그인 정보

      messages: {}, // 다국어
      langList: [], // 다국어 목록. DB 에서 가져오기

      //isSign:false //
       messageMap : {//메시지(alert) 처리를 위한 오브젝트
          title: '',  // 메시지 타이틀
          message:'',
          type: 'warning',
          auto : false
        },
       confirmMap : {//메시지(confirm) 처리를 위한 오브젝트
          title: '',
          message:'',
          type: 'info'
        },
       loadingMap : {//로딩창 처리를 위한 오브젝트
          delay:100
          ,callbackFn:function(){}
        },
       loadingDataMap : {
        },
       modalList:[]
       //isSound: false   //사운드(음성안내) 사용여부 . 기본적으로 true
  },
  mutations: {
    addMenu (state, menu) {
      state.menuList.push(menu)
    },
    removeMenu (state, idx) {
      state.menuList.splice(idx,1)
    },
    resetMenu (state){
      state.menuList = []
    },
    getLastMenu(){
      return state.menuList
    }
  },
  actions: {
    async addMenu ({ commit }, menu) {
      return new Promise((resolve, reject) => {
        commit('addMenu', menu)
        resolve()
      })
    },
    async menuDispatch ({ dispatch, commit }, menu){

      await dispatch('addMenu', menu)
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
  }
})
export default store
