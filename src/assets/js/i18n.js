/**
 * @author Captain Teemo
 * 다국어 관리하는 공통 모튤
 * */

// Import 영역
import store from '$store'
import router from "../../router/router";
import VueComponent from "vue";
import {API_BASE_URL, responseFn} from "./common";

// Require 영역
var axios = require('axios');
var queryString = require('qs');

// 공통 변수
var state = store.state;
var messages = state.messages;
var rawMessages;  // Init 에서 지정

const ROOT_KEY = "pms_msges";

if (!messages) {
  throw new Error("Messages from database is undefined ") ;
}

/**
 * Private method 영역
 * ==============================
 * */

/**
 * @param {Array} messageList 추가할 다국어 목록
 * @param {boolean} <code>true</code> if messageList contains a value already defined in database / cache
 * */
function hasDuplicateMessages(messageList) {
  for (var i = 0; i < messageList.length; i++) {
    var message = messageList[i];
    if (messages[lang].message.hasOwnProperty(message.key)) {
      return true;
    }
  }
  return false;
}

/**
 * vuei18n 에서 요구하는 데이터 구조로 변환
 * @link https://kazupon.github.io/vue-i18n/guide/started.html#javascript
 * @param {Array<object>} rawMessages
 * @return {object}
 * */
function organizeMessages(rawMessages) {
  var vuei18nMessages = {};
  state.langList = [];  // 언어 목록 초기화
  rawMessages.forEach(row => {
    var lang = row.lang;
    var key = row.key;
    // 언어 없으면 객체 추가
    if (!vuei18nMessages.hasOwnProperty(lang)) {
      vuei18nMessages[lang] = {};
      vuei18nMessages[lang][ROOT_KEY] = {};
      // 마지막으로 신규 언어 언어 목록에 추가
      state.langList.push(lang);
    }
    vuei18nMessages[lang][ROOT_KEY][key] = row.message;
  });
  return { vuei18nMessages, rawMessages };
}

/**
 * Public API
 * ==============================
 * */

// PUBLIC API
const i18n = {};

// COMMON Keys
const I18N_KEY = '_i18n';
const LANG_KEY = 'lang';

// Messages
const MESSAGES_NOT_DEFINED = "Messages not defined. Perhaps we failed to load messages from the database";

/**
 * 현제 환경의 언어 code 가져오기 ...
 * */
function getEnvLocale(env) {
  env = env || process.env;
  return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}

/**
 * 다국어 메세지 설정
 * @param {string} lang 변경할 언어 코드
 * @param {string} key 변경할 Key 값
 * @param {string} message 새로운 메시지
 * @param {function} cb (optional) 저장성공후 처리 함수
 * */
i18n.setMessage = (lang, key, message, cb) => {
  // 1. DB 업데이트. REST API 호출
  return axios.post(`${API_BASE_URL}/pms/updateMessage`,
    queryString.stringify({ lang, key, message })
  ).then(function (res) {
    // 2. DB 를 성공적으로 업데이트 했으면,
    // Cache Layer 업데이트
    messages[lang][ROOT_KEY][key] = message;
    // Callback 함수 실행
    if (typeof cb === 'function')
      return cb(res);
    // responseFn(res, args['then'], args['url'], queryString.stringify(args['param']));
  }).catch(function (r) {
    console.log(r);
    router.push('/error');
  })
};

/**
 * Cache 에서 가공된 (vuei18n API 아 맞는) 다국어 객체 가져오기
 * */
i18n.getMessages = () => {
  if (messages) {
    return messages;
  }
  throw new Error(MESSAGES_NOT_DEFINED);
};

/**
 * Cache 에서 Raw 다국어 Message 가져오기
 * */
i18n.getRawMessages = () => {
  if (rawMessages) {
    return rawMessages;
  }
  throw new Error(MESSAGES_NOT_DEFINED);
};

/**
 * 다국어 DB 에서 가져오기
 * 가져와서 Vuei18n API 에 맞게 object 구성
 * */
i18n.getMessagesFromDb = async () => {
  let response = await fetch(`${API_BASE_URL}/common/selectMessages`, {mode: 'cors'});
  return await response.json().then(messages => {
    rawMessages = messages;
    return organizeMessages(messages);
  }).catch(function (error) {
    console.log(error);
    router.push('/error');
  });
};

/**
 * 다국어 DB 에서 생데이터 가져오기
 * */
i18n.getRawMessagesFromDb = async () => {
  let response = await fetch(`${API_BASE_URL}/common/selectMessages`);
  return await response.json();
};

/**
 * 동적 (프로그램적) 으로 다국어 메시지 가져오기
 * @param {string} key 다국어 message key 값
 * @param {VueComponent} vueComp 다국어 대상 Vue Component
 * @return {string}
 * */
i18n.getMessage = (key, vueComp) => {
  var lang = state.lang || getEnvLocale();
  if (vueComp instanceof VueComponent) {
    return vueComp.$i18n.messages[lang][ROOT_KEY][key];
  }
  console.log(messages);
  return messages[lang].message[key];
};

/**
 * 다국어 메세지 추가
 * @param {string} lang 변경할 언어 코드
 * @param {string} key 변경할 Key 값
 * @param {string} message 새로운 메시지
 * @param {function} cb (optional) 저장성공후 처리 함수
 * */
i18n.addMessage = (lang, key, message) => {
  // TODO
};

/**
 * 대량 다국어 메시지 추가
 * @param {Array} messageList 다국어 메시지 리스트
 * */
i18n.addBatchMessage = (messageList) => {
  if (hasDuplicateMessages(messageList)) {
    // 중복된 다국어 Key Message 가 있다. 작업 중단.
    // TODO: 나중에 다국어 Key 정의되면 다국어 메시지로 교체
    return "teemo";
  }
  // TODO: REST API 호출
};

/**
 * 현재 언어 가져오기
 * @param {Object} vueComponent
 * @return {string} 언어 값. 예: "ko"
 * */
i18n.getLanguage = (vueComponent) => {
  return vueComponent.$cookies.get(LANG_KEY);
};

/**
 * 언어 설정
 * @param {Object} vueComponent
 * @param {string} lang 언어 코드. 예: "ko" => 한국어, "en" => 영어
 * */
i18n.setLanguage = (vueComponent, lang) => {
  if (lang.length !== 2) {
    throw new Error(`Language code must have a length of two. Current Language code: ${lang}`);
  }
  if (!(vueComponent instanceof VueComponent)) {
    throw new Error("Must pass in a vue component to setLanguage(vueComponent, lang)")
  }
  if (!vueComponent.hasOwnProperty(I18N_KEY)) {
    throw new Error(`${I18N_KEY} is not defined on this component`);
  }
  vueComponent.$cookies.set(LANG_KEY, lang);
  state.lang = lang;
  vueComponent.$i18n.locale = lang;
};

/**
 * 다국어 객체 갱신 및 초기화. DB 에서 정보 가져와서 다시 생성
 * @param {function} fn 성공후 호출되는 Callback Function
 * */
i18n.init = (fn) => {
  i18n.getMessagesFromDb().then(({ vuei18nMessages, rawMessages }) => {
    // 다국어 접속 경로
    // 상태값 초기화
    state.messages = vuei18nMessages;
    messages = rawMessages;
    if (typeof fn === "function")
      fn(vuei18nMessages);
  }).catch(error => {
    console.log(error);
    router.push('/error');
  });
};

/**
 * 새로고침
 * @param {function} fn 성공후 호출되는 Callback Function
 * */
i18n.reload = (fn) => {
  i18n.init(fn);
};

export {i18n};
