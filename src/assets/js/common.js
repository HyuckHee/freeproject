/**
 * Created by crony on 2018-05-09.
 */

import store from '$store'
import treeItem from "../../view/components/common/treegrid/default";

export const IS_LOCAL = process.env.NODE_ENV !== 'production';

//운영환경 & 개발환경 선택(자동선택된)-------------------------------------
export const IS_DEVELOPER = IS_LOCAL; //true : 개발환경, false : 운영환경
//----------------------------------------------------------
var currUrl = window.location.host;

export const API_BASE_URL = IS_LOCAL
  ? 'http://127.0.0.1:8080'
  : 'http://114.207.244.39:8077';

export const API_ANALYSIS_URL = IS_LOCAL
  ? 'http://114.207.244.39:8078'
  : 'http://114.207.244.39:8078';

// export const PRINTER_URL = 'http://192.168.50.47:8082/sjtms_print_client/print/receipt';

//파일첨부 최대 용량 설정
export const FILE_UPLOAD_MAX_SIZE =100;//MB
//측정별일 경우 최대 조회가능한 기간 설정
export const DATA_SELECT_MAX_DAY = 7;//DAY


export default {
  API_BASE_URL,
  IS_LOCAL,
  API_ANALYSIS_URL
}

var axios = require('axios');
var queryString = require('qs');


export const init = (callback, type, prevTime) => {

  //시간타입(day, hours, minutes) default값
  var defaultType = 'day';

  //이전일자 default값
  var defaultTime = 1;

    getData({
      url: '/getNowDay',
      param : {},
      loading: false, 					//option (default : false)
      delay: 1, 						//option
      target: this,
      then: (data) => {
        type = type || defaultType;
        prevTime = prevTime || defaultTime;
        var toDate = new Date(data.serverDateTime);
        var fromDate = new Date(data.serverDateTime);

        //시간타입(일,시간,분)에따라 fromDate 분기
        if(type === 'day'){
          fromDate = new Date(Date.parse(fromDate) - prevTime * 1000 * 60 * 60 *24)
        } else if(type === 'hours'){
          fromDate = new Date(Date.parse(fromDate) - prevTime * 1000 * 60 * 60)
        } else if(type === 'minutes'){
          fromDate = new Date(Date.parse(fromDate) - prevTime * 1000 * 60)
        }

        callback(fromDate, toDate);
      }
    });

}

export const searchAuth = (menuList, task) => {
  for (var i=0; i < menuList.length; i++) {
    if (menuList[i].task === task) {
      return menuList[i].auth;
    }
  }
}

// TODO : 동적으로 MENU KEY 값을 가져 오도록 수정 예정
export const searchMenuNm = (menuList, task, key) => {
  // var keyVal = key;
  for (var i=0; i < menuList.length; i++) {
    if (menuList[i].task === task) {
      return menuList[i].name;
    }
  }
}


/**
 * 토큰을 저장한다.
 * @param token
 * @returns {boolean}
 */
export const setToken = token => {
  sessionStorage.setItem("userToken", token);
  return true;
}

/**
 * 토큰을 반환한다.
 */
export const getToken = () => {
  var token = sessionStorage.getItem("userToken");
  if (token == null) {
    token = '';
  }
  return token;
};


/**
 * 토큰을 제거한다.
 */
export const resetToken = () => {
  sessionStorage.removeItem("userToken")
};


export const getUserInfo = () => {
  var obj = {};
  obj['token'] = (sessionStorage.getItem("centerId") == null) ? false : sessionStorage.getItem("centerId");
  return obj;
};
export const setUserInfo = userInfo => {
  store.state.isSign = true;
  store.state.centerId = userInfo.centerId;
  store.state.centerName = userInfo.centerName;
}
export const resetUserInfo = () => {
  sessionStorage.removeItem("userToken");
  store.state.isSign = false;
  store.state.centerId = '';
  store.state.centerName = '';
};

// const DEVELOPER 의 상태에 따라 메시지 출력여부를 결정한다.
export const setMessage = (msg, param) => (IS_DEVELOPER) ? (param != undefined) ? console.log(msg, 'background: #222; color: #bada55', 'color: red;', 'color: blue;', 'background: #222; color: #bada55', 'color: red;', 'color: blue;', 'background: #222; color: #bada55', param) : console.log(msg) : false;
// 메시지를 출력하고 Response callback function을 호출한다.
export const responseFn = (response, resFn, url, param) => {
  setMessage("%c#Requst URI" + "%c => " + "%c[" + url + "] %c#Requst param" + "%c => " + "%c[" + param + "] %c#Response", response.data);
  return resFn(response.data);
}
// axios로 데이터를 조회한다.
export const getData = args => {



  /*#########LOADING###########*/
  if (args.loading == undefined) {    args.loading = false;  }
  if (args.delay == undefined) {    args.delay = 1;  }

  if (args.loading) {
    store.state.loadingMap = {
      delay: args.delay
      , callbackFn: function (data) {
        responseFn(data, args['then'], args['url'], queryString.stringify(args['param']));
      }
    }
    args['type'] = 'setData';
    store.state.loadingDataMap = args;
    //로딩창 호출
    args.target.$modal.show('onlyLoading')

    return;
  }
  /*#########LOADING###########*/

  var self=this;
  //데이터를 조회할때 자동으로 token을 추가한다.
  var newMap = args['param'];
  newMap['userToken'] = getToken();

  //axios
  axios.post(API_BASE_URL + args['url'], queryString.stringify(newMap), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(function (res) {

    responseFn(res, args['then'], args['url'], queryString.stringify(args['param']));

    let t = JSON.parse(JSON.stringify(res.data));
    if (!t || typeof t != "object") {
      throw new Error("Failed to parse JSON data");
    }

  })

  /*
  /!*#########LOADING###########*!/
  if (args.loading == undefined) {
    args.loading = false;
  }
  if (args.delay == undefined) {
    args.delay = 2000;
  }

  if (args.loading) {

    store.state.loadingMap = {
      delay: args.delay
      , callbackFn: function (data) {
        responseFn(data, args['then'], args['url'], queryString.stringify(args['param']));
      }
    }
    args['type'] = 'getData';
    store.state.loadingDataMap = args;
    //로딩창 호출
    args.target.$modal.show('dataLoading')

    return;
  }
  /!*#########LOADING###########*!/

  //데이터를 조회할때 자동으로 token을 추가한다.
  var newMap = args['param'];

  //데이터 조회 시작.
  axios({
    method: 'post',
    url: API_BASE_URL + args['url'],
    params: newMap,
  }).then(function (res) {
    responseFn(res, args['then'], args['url'], queryString.stringify(args['param']));
  }).catch(function (r) {
    console.log(r);
    router.push('/error');
  })
  */


};


// axios로 데이터를 저장한다.
export const setData = args => {

  /*#########LOADING###########*/
  if (args.loading == undefined) {
    args.loading = false;
  }
  if (args.delay == undefined) {
    args.delay = 1;
  }

  if (args.loading) {

    store.state.loadingMap = {
      delay: args.delay
      , callbackFn: function (data) {
        responseFn(data, args['then'], args['url'], queryString.stringify(args['param']));
      }
    }
    args['type'] = 'setData';
    store.state.loadingDataMap = args;
    //로딩창 호출
    args.target.$modal.show('onlyLoading')

    return;
  }
  /*#########LOADING###########*/

  var self = this;
  //데이터를 조회할때 자동으로 token을 추가한다.
  var newMap = args['param'];
  newMap.userToken = getToken();

  //axios
  axios.post(API_BASE_URL + args['url'], queryString.stringify(newMap), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(function (res) {
    responseFn(res, args['then'], args['url'], queryString.stringify(args['param']));

    let t = JSON.parse(JSON.stringify(res.data));
    if (!t || typeof t != "object") {
      throw new Error("Failed to parse JSON data");
    }

  }).catch(function (r) {
    console.log("에러가 발생했습니다. JSON.parse 에러라면 권한이 불충분하거나 정상적인 호출이 아닌 경우 발생합니다.");
    console.log(r);

    location.replace("/#/error");
    //self.$router.push('/error');
    //alert("브라우져 버전 9이상부터 지원합니다. 브라우져를 업데이트하거나, 크롬등의 다른 브라우져를 사용하세요.")
  })

}

// axios로 파일을 전송한다.
export const setFile = args => {
  //데이터를 조회할때 자동으로 token을 추가한다.
  var newMap = args['param'];
  var files = args['file'];

  newMap.userToken = getToken();  // TODO 삭제

  var formData = new FormData();

  for(var i=0; i<files.length; i++){
    var file = files[i];
    formData.append('files', file);
  }

  formData.append("data",JSON.stringify(newMap));
  formData.append("userToken",getToken());

  //axios
  axios.post(API_BASE_URL + args['url'], formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => responseFn(res, args['then'], args['url'], queryString.stringify(args['param'])))
}

//Attach fileDown
export const fileDown = args => {
  var newMap = args["param"];
  newMap.userToken = getToken();

  var self = this;

  axios({
    method: 'post',
    url: API_BASE_URL + args["url"],
    params: {'fileId':newMap.fileId, userToken:getToken()},
    responseType: 'arraybuffer'
  }).then(function(response){

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', newMap.name);
    document.body.appendChild(link);
    link.click();

  }).catch(function(r){
    console.log(r);
  })


}



//경고창 호출 (확인창 있음)
export const alert = (param, fn) => {
  store.state.messageMap = {
    message: param.msg,
    title: param.title || '',
    //Type 종류 : info, chk, warning, del
    type:  param.type || 'warning',
    callbackFn: fn || (() => {})
  }

  //auto hide 처리
  //param에 auto가 ture면 자동으로 닫는다.
  if (param.auto == undefined) {
    param.auto = false;
  }

  store.state.messageMap.auto = param.auto;

  //메시지창 호출
  param.target.$modal.show('alert', {}, {
    zIndex: 1002
  });
}

//경고창(auto) 호출 (확인창 없음)
export const alertAuto = (param, fn) => {
  store.state.messageMap = {
    message: param.msg,
    title: param.title || '',
    //Type 종류 : info, chk, warning, del
    type:  param.type || 'chk',
    callbackFn: fn || (() => {})
  }

  //auto hide 처리
  //param에 auto가 ture면 자동으로 닫는다.
  if (param.auto == undefined) {
    param.auto = false;
  }

  store.state.messageMap.auto = param.auto;

  //메시지창 호출
  param.target.$modal.show('alertAuto', {}, {
    zIndex: 1002
  });
}

//확인창 호출
export const confirm = (param, fn) => {
  store.state.confirmMap = {
    message: param.msg,
    title: param.title || '',
    //Type 종류 : info, chk, warning, del
    type:  param.type || 'info'
    , callbackFn: fn
  }
  //메시지창 호출
  param.target.$modal.show('confirm');
}

//로딩 호출
export const loading = (param, fn) => {
  store.state.loadingMap = {
    delay: param.delay
    , callbackFn: fn
  }
  //로딩창 호출
  param.target.$modal.show('loading')
}
//로딩 호출
export const loadingComp = (param, fn) => {
  store.state.loadingMap = {
    delay: param.delay
    , callbackFn: fn
  }
  //로딩창 호출
  param.target.$modal.show('loadingComp')
}

import MyComponent from '../../view/modal/system/sysFreeBoardModal.vue'
// modal injection
export const showModal = (param, fn) => {

  //데이터 전송받기
  //옵션처리
  //얼랏창도 처리

  let optWidth = 450;
  let optHeight = 600;
  //let optDraggable = true;
  let optDraggable = ".drag-handler";
  let optClickToClose = false;

  let pivotX = 0.5;
  let pivotY = 0.5;

  var options = {
    width:optWidth,
    height:optHeight,
    draggable:optDraggable,
    clickToClose:optClickToClose,
    adaptive:false,
    resizable:false,
    pivotX:pivotX,
    pivotY:pivotY
  };
  if(param.options !== undefined){
    for(var item in param.options){
      options[item] = param.options[item];
    }
  }

  //팝업 중복 오픈을 막기위해 uniqueKey가 존재한다면 처리
  if(param.modalKey !== undefined){
    //store에 중복되는지 확인.
    let modalList = store.state.modalList;
    for(var index in modalList){
      if(modalList[index]['modalKey'] == param.modalKey){
        //이미 열려있음
        alert({msg: param.target.$t('msg.Z110'), target: param.target});
        return;
      }
    }

    //중복이 발견되지 않으면 저장하고 계속 진행
    store.state.modalList.push({'modalKey':param.modalKey});
  }


  param.file.then((modal)=>{
    param.target.$modal.show(modal,
      {'params': param.params,
        // 수정 / 삭제후 데이터 처리
        handlePayload: (data) => {
          fn(data);
        }
      }, options,
      {
        'before-close': (event) => {
          let modalKey = param.modalKey;
          let modalList = store.state.modalList;
          for(let index in modalList){
            if(modalList[index]['modalKey'] == modalKey){
              store.state.modalList.splice(index,1)
              break;
            }
          }
        }
      })
  })


  /*param.target.$modal.show({
    template: param.file,
    props: ['params', 'handlePayload']
  },
  {'params': param.params,
    // 수정 / 삭제후 데이터 처리
    handlePayload: (data) => {
      fn(data);
    }
  },
  options,
  {  }
  )*/

  /*param.target.$modal.show(
    () => param.file,
    {'params': param.params,
      // 수정 / 삭제후 데이터 처리
      handlePayload: (data) => {
        fn(data);
      }
    }, //params
    options,//option
  );*/


  //팝업이 열릴때는 index 조정을 피하기 위해 cu-no를 전체 삭제한다. 2019-07-11
  $("#modals-container").find(".v--modal-overlay").each(function () {
    $(this).removeAttr('cu-no');
  })

  //.not('.btn-popup')
  /**[클릭이벤트 등록]*/
  $("section.modal.pop").unbind("click").on('click', function() {
    var self = $(this);
    changeIndex(self)
  });
}

function changeIndex(self) {

  //이벤트 재 등록 재귀 호출
  $("section.modal.pop").unbind("click").on('click', function() {
    var fac = $(this);
    changeIndex(fac)
  });

  //현재 아이템
  var prevValue = Number(self.closest(".v--modal-overlay").attr("cu-no"));
  var popupList = [];
  var DEFAULT_Z_INDEX = 600;

  //cu-no 구하기 data-modal="_dynamic_modal_17"
  $("#modals-container").find(".v--modal-overlay").each(function () {
    if (!$(this).attr("cu-no")) $(this).attr("cu-no", $(this).attr("data-modal").replace("_dynamic_modal_", ""));
  })

  //전체 배열 구하기
  $("#modals-container").find(".v--modal-overlay").each(function () {
    popupList.push(Number($(this).attr('cu-no')))
  });

  if (popupList.length === 0) return;

  var maxValue = popupList[0];

  for (var i = 1; i < popupList.length; i++) {
    if (popupList[i] > maxValue) maxValue = popupList[i];
  }

  //현재 대상을 가장 높은 값으로 변경하고 나머지를 조정한다.
  $("#modals-container").find(".v--modal-overlay").each(function () {
    var currValue = Number($(this).attr("cu-no"));

    if(currValue > prevValue){
      //self보다 큰 대상은 -3씩을 변경하고 z-index를 변경한다.
      let newValue = currValue-3;
      $(this).attr("cu-no", newValue);
      $(this).css("z-index", DEFAULT_Z_INDEX + newValue);
    } else if(currValue < prevValue) {
      //self보다 작은대상은 변화없음
      $(this).css("z-index", DEFAULT_Z_INDEX + currValue);
    } else if(currValue == prevValue){
      //현재 대상 max로 변경해줌
      $(this).attr("cu-no", maxValue);
      $(this).css("z-index", DEFAULT_Z_INDEX + maxValue);
    }
  });


}

/**
 * 나중에 주석달기
 * @param {Object} params
 * @return {string} 예: "en\english|ko\korean|cn\chinese"
 * */
export const langToString = (params) => {

  var resultStr = "";
  var keys = Object.keys(params);
  var lastIndex = keys.length - 1;

  if (lastIndex > -1) {
    keys.forEach((key, index) => {
      resultStr += key+"\\" + params[key];
      if (index !== lastIndex) {
        resultStr += "|";
      }
    });
  }
  return resultStr;
}


/**
 * 엑셀 파라미터 값들 체크
 * */
function validateExcelDownloadParams(params) {
  if (Object.prototype.toString.call(params) !== "[object Object]") {
    console.error("Params in downloadExcel: ", params);
    throw new Error("params must be of type object")
  }

  if (!('url' in params)) {
    console.error("Params in downloadExcel: ", params);
    throw new Error("'url' must be defined in params")
  }

  if ('colDefs' in params) {
    var colDefs = params.colDefs;
    if (!Array.isArray(colDefs)) {
      console.error("Headers must be an array: ", colDefs);
      throw new Error("headers must be of type array");
    }
    if (colDefs.length < 1) {
      console.error("Headers must contain more than one element: ", colDefs);
      throw new Error("Headers must contain more than one element");
    }
  }
}

/**
 * Excel 기능
 * @param {string} fileName
 * @param {object} params
 * @param {VueComponent} vm
 */
export const downloadExcel = (fileName, params, vm) => {

  /// Validation 처리
  validateExcelDownloadParams(params);

  params.fileName = fileName;
  params.userToken = getToken();

  if ("colDefs" in params) {
    params.colDefs = JSON.stringify(params.colDefs);
  }

  try {
    vm.$modal.show('modalExcelLoading');

    axios.post(API_BASE_URL+'/common/downloadExcel', queryString.stringify(params), {
      headers : {'X-Requested-With': 'XMLHttpRequest'},
      responseType: 'arraybuffer'
    }).then(function(response) {
      if (response.data.byteLength > 0) {
        const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName + '.xlsx');
        document.body.appendChild(link);
        link.click();
        // 다운로드후, 임시 <a> tag 삭제
        document.body.removeChild(link);

        vm.$modal.hide('modalExcelLoading');
      } else if (vm) {
        // 다국어 메시지 처리
        alert({msg: vm.$t('msg.Z016'), target: vm});
        vm.$modal.hide('modalExcelLoading');
      }
    }).catch(function(r){
      vm.$modal.hide('modalExcelLoading');
      console.log(r);
    })
  } catch (e) {
    vm.$modal.hide('modalExcelLoading');
    alert({msg: vm.$t('msg.Z037'), target: vm});
  }
};

/**
 * Excel 기능 -MultiSheet Down
 * @param {string} fileName
 * @param {object} params
 * @param {VueComponent} vm
 */
export const downloadMultiSheetExcel = (fileName, params, vm) => {

  var dataParam = {};

  dataParam.userToken = getToken();

  dataParam.dataList = JSON.stringify(params);


  try {
    vm.$modal.show('modalExcelLoading');

    axios.post(API_BASE_URL+'/common/downloadMultiSheetExcel', queryString.stringify(dataParam), {
      headers : {'X-Requested-With': 'XMLHttpRequest'},
      responseType: 'arraybuffer'
    }).then(function(response) {
      if (response.data.byteLength > 0) {
        const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName + '.xlsx');
        document.body.appendChild(link);
        link.click();
        // 다운로드후, 임시 <a> tag 삭제
        document.body.removeChild(link);

        vm.$modal.hide('modalExcelLoading');
      } else if (vm) {
        // 다국어 메시지 처리
        alert({msg: vm.$t('msg.Z016'), target: vm});

        vm.$modal.hide('modalExcelLoading');
      }
    }).catch(function(r){
      vm.$modal.hide('modalExcelLoading');
      console.log(r);
    })
  } catch (e) {
    vm.$modal.hide('modalExcelLoading');
    alert({msg: vm.$t('msg.Z037'), target: vm});
  }
};

/**
 * Excel 기능 : params data 를 엑셀로 다운
 * @param {string} fileName
 * @param {object} params
 * @param {VueComponent} vm
 */
export const convertListToExcel = (fileName, params, vm) => {

  /// Validation 처리
  validateExcelDownloadParams(params);

  params.fileName = fileName;
  params.userToken = getToken();

  if ("colDefs" in params) {
    params.colDefs = JSON.stringify(params.colDefs);
  }

  try {
    axios.post(API_BASE_URL+'/common/convertListToExcel', queryString.stringify(params), {
      headers : {'X-Requested-With': 'XMLHttpRequest'},
      responseType: 'arraybuffer'

    }).then(function(response) {

      if (response.data.byteLength > 0) {
        const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName + '.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (vm) {
        alert({msg: vm.$t('msg.Z016'), target: vm});
      }

    }).catch(function(r){
      console.log(r);
    })
  } catch (e) {
    alert({msg: vm.$t('msg.Z037'), target: vm});
  }

};


/**
 * Root Key 검색 및 생성
 * @param {Array} dataList 원본 데이터
 * @param {String} pk 현재 데이터 PK 값
 * @param {String} upperPk 상위 데이터 PK 값
 * @return {Object} Root node key map
 * */
function getRootKeys(dataList, pk, upperPk) {
  var keys = {};
  dataList.forEach((datum, index) => {
    var currentPk = datum[pk];
    var parentPk = datum[upperPk];
    keys[currentPk] = { key: currentPk, parentKey: parentPk };
  });
  var key;
  var rootKeys = {};
  for (key in keys) {
    var item = keys[key];
    if (!(item.parentKey in keys)) {
      rootKeys[key] = null;
    }
  }
  return rootKeys;
}

/**
 * DB 에서 가져온데이터를 Tree Grid 에서 사용하는 데이터
 * [
 *  {
 *    equipCd: "설비 A",
 *    regDt: ... ,
 *    updDt: ... ,
 *    ...
 *    ...
 *    key: 'uniqueCode'
 *    upperKey: 'uniqueCode 의 부모코드 (상위코드)'
 *  },
 *  ...
 * ]
 * 참고: dataList 에 있는 객체 mutation 됩니다.
 * 원본 데이터 mutation 원하지 않으면, deep copy 하고 쓰세요 ~~
 *
 * @param {Array} dataList 서버에사 받은 데이터.
 * @param {string} pk 아이템의 고유 키값 (primary key).
 * @param {string} upperPk 상위 아이텤의 고유 키값 (upper primary key).
 *
 * Optional Parameters
 * @param {string} childrenKey 자료구조에 자식 node 를 표기하는 고유 키값. Default: "children"
 * @param {string} gridPropKeyPrefix. 그리드에서 사용하는 property 의 prefix 값. Default: "tree_grid_"
 *
 * */
export const toTreeGridJson = (dataList, pk, upperPk, childrenKey, gridPropKeyPrefix) => {

  // 빠른 검색을 위한 Index
  var searchIndex = {};
  // 결과
  var result = [];
  childrenKey = childrenKey || "children";        // Default 값 Children
  gridPropKeyPrefix = gridPropKeyPrefix || treeItem.keyPrefix;    // Tree grid 구분 key 값

  var rootKeys = getRootKeys(dataList, pk, upperPk);

  // Index 생성
  dataList.forEach((data, index) => {

    var pkValue = data[pk];
    // var parentPkValue = data[upperPk];

    // 대소문자 안 가리기. 예: ROOT, root 는 같다.
    if (pkValue in rootKeys) {
      result.push(data);
    }

    // 갬색용 dictionary 에 추가
    if (!(pkValue in searchIndex)) {
      // Index 에 추가 - 빠른 검색
      searchIndex[pkValue] = data;

      // Item 값 설정
      data[gridPropKeyPrefix + "parentIndex"] = -1;
      data[gridPropKeyPrefix + "index"] = index;
      // data[gridPropKeyPrefix + "isSelected"] = false;
      // data[gridPropKeyPrefix + "isOpen"] = false;
      // Children property 추가
      data[childrenKey] = [];
    }
  });

  dataList.forEach(data => {
    var pkValue = data[pk];
    var parentPkValue = data[upperPk];
    // Children 있으면, Index 에서 부모를 빨리 검색
    if (parentPkValue in searchIndex) {
      var parent = searchIndex[parentPkValue];
      var parentIndex = parent[gridPropKeyPrefix + "index"];

      // Child 추가
      parent[childrenKey].push(data);

      // Parent index 등록
      searchIndex[pkValue][gridPropKeyPrefix + "parentIndex"] = parentIndex;
      data[gridPropKeyPrefix + "parentIndex"] = parentIndex;
    }
  });

  // 개층구조 데어터를 가공 못하면
  // 예: 부모코드 있는 row 가 없을 경우
  // 원본 데이터 전달
  if (!result.length) {
    result = dataList;
  }

  // 데이터 가공
  return result;
};

/**
 * Date picker 와 같이 쓰는 함수
 * Private 함수
 * @param {string} lang: 언어 코드. 예: 'en', 'ko'
 * @return {boolean}
 * */
var isValidLang = function(lang) {
  return lang === "ko" || lang === "en" || lang === "zh";
};

/**
 * Datepicker Language 가져오기
 * 한국어는 지원 안하는 언어라, 값을 생성한다
 * @param {string} lang 언어. 예: "en" 영어, "zh" 중국어, "ko" 한국어
 *
 * // Optional parameter
 * @param {string} lang
 * @param {string} defaultLang 입력한 언어가 유효하지 않으면, fallback 한다
 * @return {object|string} 한국어는 지원을 안하니 ... 여기서 생성한다.
 * 지원하는 언어면, "string" 값을 return 한다.
 * */
export const getDatePickerLang = (lang, defaultLang) => {

  defaultLang = defaultLang || "en";
  // cn 지원
  if (lang === "cn") {
    lang ="zh";
  }
  // 언어 및 default lang validation
  if (!isValidLang(lang)) {
    lang = defaultLang ;
    if (!isValidLang(lang)) {
      lang = "en";
    }
  }

  // 한국어는 지원 안한다 ...
  if (lang === "ko") {
    return {
      days: ['일', '월', '화', '수', '목', '금', '토'],
      months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      pickers: ['다음 7일', '다음 30일', '전 7일', '전 30일'],
      placeholder: {
        date: '날짜 선택',
        dateRange: '날짜 : 시간 선택'
      }
    }
  }
  return lang;
};


/**
 * Date 객체 => string 형식으로 Return
 * @param {date}
 * @param {param} //month : yyyymm day: yyyymmdd hour : yyyymmddHH second : yyyymmddHHMMSS
 * @return {string} //month : yyyymm day: yyyymmdd hour : yyyymmddHH second : yyyymmddHHMMSS
 */
export const dateToString = (date, param) => {

  var year = date.getFullYear().toString();
  var month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
  var day = date.getDate().toString().length == 1 ? '0' + date.getDate().toString() : date.getDate().toString();
  var hour = date.getHours().toString().length == 1 ? '0' + date.getHours().toString() : date.getHours().toString();
  var minute = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
  var second = date.getSeconds().toString().length == 1 ? '0' + date.getSeconds().toString() : date.getSeconds().toString();

  if (Object.prototype.toString.call(date) === "[object Date]" && param == "month") {
    // return date.toISOString().slice(0, 8).replace(/-/g, "");
    return year + month
  } else if (Object.prototype.toString.call(date) === "[object Date]" && param == "day") {
    return year + month + day
  } else if (Object.prototype.toString.call(date) === "[object Date]" && param == "hour") {
    return year + month + day + hour
  } else if (Object.prototype.toString.call(date) === "[object Date]" && param == "second") {
    return year + month + day + hour + minute + second
  } else {
    return '';
  }
};

/**
 * string => Date 형식으로 Return
 * @param {string}
 * @return {date} //month : yyyymm day: yyyymmdd hour : yyyymmddHH second : yyyymmddHHMMSS
 */
export const stringToDate = (string) => {
  var year = string.substr(0, 4);
  var month = string.substr(4, 2);
  var day = string.substr(6, 2);

  return new Date(year, month - 1, day);
};

/**
 * fromDate toDate 배교 => boolean 형식으로 Return
 * @param {fromDate}
 * @param {toDate}
 * @return {boolean}
 */
export const dateCompare = (fromDate, toDate) => {
  if (Object.prototype.toString.call(fromDate) === "[object Date]" && Object.prototype.toString.call(toDate) === "[object Date]")
    return fromDate - toDate < 0 ? false : true;
  else
    return true;
};

export const setDataRegInExcel = args => {
  //데이터를 조회할때 자동으로 token을 추가한다.
  var newMap = args['param'];
  var files = args['file'];

  var formData = new FormData();

  for(var i=0; i<files.length; i++){
    var file = files[i];
    formData.append('openFile', file);
  }

  formData.append("data",JSON.stringify(newMap));
  formData.append("userToken",getToken());

  args.target.$modal.show('modalExcelLoading');

  //axios
  axios.post(API_BASE_URL + args['url'], formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    args.target.$modal.hide('modalExcelLoading');
    responseFn(res, args['then'], args['url'], queryString.stringify(args['param']))
  })
};


//
export const getCorrelateData = args => {

  /*#########LOADING###########*/
 /* if (args.loading == undefined) {
    args.loading = false;
  }
  if (args.delay == undefined) {
    args.delay = 1;
  }

  if (args.loading) {

    store.state.loadingMap = {
      delay: args.delay
      , callbackFn: function (data) {
        responseFn(data, args['then'], args['url'], queryString.stringify(args['param']));
      }
    }
    args['type'] = 'setData';
    store.state.loadingDataMap = args;
    //로딩창 호출
    args.target.$modal.show('onlyLoading')

    return;
  }*/
  /*#########LOADING###########*/

  var self = this;
  //데이터를 조회할때 자동으로 token을 추가한다.
  var newMap = args['param'];
  newMap.userToken = getToken();

  //axios
  axios.post(API_ANALYSIS_URL + args['url'],queryString.stringify(newMap), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }).then(function (res) {
    console.log("----------------@@")
    console.log(res)
    responseFn(res, args['then'], args['url'], queryString.stringify(args['param']));
  }).catch(function (r) {
    console.log("에러가 발생했습니다. JSON.parse 에러라면 권한이 불충분하거나 정상적인 호출이 아닌 경우 발생합니다.");
    console.log(r);
    location.replace("/#/error");
  })

};

export const checkTarget = () => {
  throw new Error("Missing parameter! [=checkTarget]");
}

/**
 * 일지 Get Data
 * @param {String} // rootId
 * @return {Object}
 */
export const reportGetData = (target = checkTarget()) => {

  let resultObj = {};

  // 'pts-tag'     -> [PTS_DOC_DATA] 테이블에 저장할 데이터
  // 'pts-etc-tag' -> [PTS_ETC_DATA] 테이블에 저장할 데이터
  let tagList = ['pts-tag', 'pts-etc-tag'];

  for(let tag of tagList){

    let dataArray = [];
    $(target).find('['+tag+']').each(function(){

      let tagCd = $(this).attr(tag);
      let sVal = $(this).val();
      let obj = {
        'tagCd' : tagCd,
        'sVal' : sVal || ''
      }
      dataArray.push(obj);
    });

    resultObj[tag]  = JSON.stringify(dataArray);

  }

  return resultObj;

};


/**
 * 일지 Set Data
 * @param {VueComponent}
 * @return {Object}
 */
export const reportSetData = (target = checkTarget(), data, state = 'view') => {


    var dataList = data.dataList;
    //var etcDataList = data.etcDataList;

    if(dataList.length > 0) {
      for(var idx in dataList){

        var tagCd = "";
        var sVal = "";
        var tagType = "";  // [pts-tag] : [PTS_DOC_DATA] 테이블  , [pts-etc-tag] : [PTS_ETC_DATA] 테이블

        tagCd = dataList[idx]['tagCd'];
        sVal = dataList[idx]['sVal'];
        tagType = dataList[idx]['tagType'];

        $(target).find("["+tagType+"='"+tagCd+"']").val(sVal);

        /*if(state != 'view'){
          $(target).find("["+tagType+"='"+tagCd+"']").val(sVal);
        } else if(state == 'view') {
          sVal = sVal || '';
          $(target).find("["+tagType+"='"+tagCd+"']").parent().append("<span>"+sVal+"</span>");
          $(target).find("["+tagType+"='"+tagCd+"']").parent().find('button').remove();
          $(target).find("["+tagType+"='"+tagCd+"']").remove();
        }*/

      }
    }

};
