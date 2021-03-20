<template>
  <header id="header" cu-state="normal">
    <nav>
      <ul id="gnb">
        <li class="top-menu"  v-for="(menu) in userAuthMenuList" :key="menu.menuNm"><!--<a @click="addTask(menu3.menuUrl,menu3.menuNm,menu.menuCd,menu3.menuCd)" href="#">-->{{menu.menuNm}}<!--</a>--></li>
      </ul>
    </nav>
  </header>
</template>
<script>
// import * as $com from '$com'
import store from "$store";
export default {
name: "menubar",
  computed:{
    userAuthMenuList() {
      return store.state.userAuthMenuList
    }
  },
  methods:{
          // addTask(task, name, topMenu, menuCd){
          //   //-----------------------------------------------------------------------------------
          //
          //   console.log("#########################################################");
          //   console.log("############ Menu: [ "+task+" ] ################");
          //   console.log("#########################################################");
          //
          //   var maxOpenCnt = 10; //최대 오픈 가능한 수
          //   var minOpenCnt = 7; // 작업표시줄 개당 사이즈 조절에 사용
          //   if(task==null||task==''){
          //     console.log('It is an unregistered menu.')
          //     return
          //   }
          //   //메뉴권한 체크
          //   $com.getData({
          //     url : '/checkMenuAuth',
          //     param : {'menuCd':menuCd},
          //     loading: false, //option (default : false)
          //     delay: 100, //option
          //     target: this,
          //     then : (r)=>{
          //       if(r.result){
          //
          //         //네비게이션 즐겨찾기 여부 조회
          //         store.state.favoriteYn = r.favoriteYn;
          //
          //         store.state.menuNavigate = r.menuNevi;
          //
          //         //화면 오픈 및 네비게이션 처리
          //         store.currTask = task;
          //         this.currTaskName = name;
          //
          //         //메뉴추가 작업 및 작업표시줄 작업.
          //         var isOpened = false;//이미 열려있는지 check
          //         var opendCnt = 0; //열려있는 창 갯수
          //
          //         //############################taskBox처리###############################
          //         //현재 열려있는지 확인한다음. 열려있다면 z-index만 증가시키고 켜져있지 않다면 open만한다.
          //         var opendMenuList = store.state.menuList;
          //         for(var idx in opendMenuList){
          //           if(opendMenuList[idx]['menuCd'] == menuCd){
          //             isOpened = true;
          //             //alert('The menu is already open.')
          //             //$com.alertAuto({msg: this.$t("msg.Z069"), target: this, auto: true, type:'warning'}, () => {});
          //
          //             break;
          //           }
          //         }
          //
          //         //taskBar처리
          //         $(".taskBar").each(function(){
          //           //모든메뉴의 갯수 합산
          //           opendCnt += 1;
          //         })
          //         //최대 매뉴수 제한
          //         if(!isOpened && (opendCnt >= maxOpenCnt)){
          //           // $com.alertAuto({msg: ' You can only open up to '+maxOpenCnt+' menus. ', target: this, auto: true, type:'warning'}, () => {});
          //           $com.alertAuto({msg: maxOpenCnt+'개의 메뉴만 열 수 있습니다.', target: this, auto: true, type:'warning'}, () => {});
          //           return;
          //         }
          //
          //         //############################taskBox처리###############################
          //         //작업표시줄 관리
          //         //기존 목록 비활성화
          //         var activeTask = "";
          //         $(".taskBar").each(function(){
          //           if($(this).hasClass('active')){
          //             activeTask = $(this).attr('id-task')
          //           }
          //         });
          //         $(".taskBar").each(function(){
          //           $(this).removeClass('active');
          //         });
          //         if(!isOpened){
          //           //작업표시줄에 추가
          //           //vuex에 task저장
          //           //store.commit('addMenu', {'task':task, 'name':name, 'topMenu':topMenu, 'menuCd':menuCd})
          //           store.dispatch('menuDispatch', {'task':task, 'name':name, 'topMenu':topMenu, 'menuCd':menuCd, 'auth':r.menuAuthRole}).then(()=>{
          //             //화면에 전환을 자연스럽게 하기위해서 현재열려있는 창을 가장 앞으로 한다.
          //             $(".taskBox").each(function(){
          //               if($(this).attr("page-id") == activeTask){
          //                 $(this).css('z-index', '20');
          //               }
          //             })
          //             $(".taskBox").each(function(){
          //               if($(this).attr("page-id") != activeTask && $(this).attr("page-id") != task){
          //                 $(this).css('z-index', '10');
          //               }
          //             })
          //           })
          //
          //           //작업표시줄 사이즈 위해서 카운트 추가
          //           opendCnt += 1;
          //         } else {
          //           //이미 열려있는 대상 active처리
          //           $(".taskBar").each(function(){
          //             if($(this).attr('id-task') == task){
          //               $(this).addClass('active');
          //             }
          //           })
          //
          //           $(".taskBox").each(function(){
          //             if(task == $(this).attr("page-id")){
          //               $(this).css('z-index', '400');
          //             } else {
          //               $(this).css('z-index', '10');
          //             }
          //           })
          //         }
          //
          //         var taskbarWidth = Number($("#taskUl").width());
          //         var taskWidth = 0;
          //         var taskBarSize = (90 / opendCnt)
          //         this.$nextTick(()=>{
          //           //############################taskBar 사이즈조절###############################
          //           $(".taskBar").each(function(){
          //             //active처리
          //             if($(this).attr('id-task') == task){
          //               $(this).addClass('active');
          //             }
          //             //모든메뉴의 넓비합 합산
          //             taskWidth += Number($(this).width());
          //           })
          //           //taskBar 넓이 최적화
          //           if(opendCnt > minOpenCnt || taskWidth > taskbarWidth){
          //             $(".taskBar").each(function(){
          //               $(this).css("width", taskBarSize+"%");
          //             })
          //           } else {
          //             $(".taskBar").each(function(){
          //               $(this).css("width", (90/minOpenCnt)+"%");
          //             })
          //           }
          //         })
          //
          //
          //         //현재수행한 대상의 최상위 메뉴바에 active 클래스 추가
          //         $(".top-menu").each(function(){
          //           $(this).removeClass('active');
          //         });
          //         $("#"+topMenu).addClass('active');
          //       } else {
          //         alert(r.message)
          //       }
          //     }})
          //
          // }
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
