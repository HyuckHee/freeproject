/**
 * @Author Jay Lee
 * 다국어 Module - v2
 * Binding 을 사용안한고 순수한 JavaScript 방식으로
 * 처리해주는 Module
 *
 *  참고: 이 모듈은 임시 테스트 용 입니다. 다국어 처리 법이 결정이 되면, 업데이트 할 예정 입니다.
 * */

// 다국어 보관하는 자료구조
import {API_BASE_URL} from "./common";
import router from "../../router/router";

/**
 * MESSAGES: {
 *   en: {
 *     // 영어 메시지
 *   },
 *   ko: {
 *     // 한국어 메시지
 *   }
 *   .. 기타등등
 * }
 *
 * */
var messageStore = {};
var language;

/**
 * Local 함수 영역
 * =======================================
 * */

/**
 * 현제 환경의 언어 code 가져오기 ...
 * */
function getEnvLocale(env) {
  env = env || process.env;
  return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}

/**
 * 현재 언어 가져오기
 * */
function getLanguage() {
  var lang = getEnvLocale();
  if (lang) {
    return lang;
  }
  return language;
}

/**
 * 객체 Deep copy 하기
 * 참고: deep copy 할 때, Date 객체는 ISO String 유형으료 복구 된다.
 * Date 객체로 복구 안됨.
 * */
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * vuei18n 에서 요구하는 데이터 구조로 변환
 * @link https://kazupon.github.io/vue-i18n/guide/started.html#javascript
 * @param {Array<object>} rawMessages
 * @return {object}
 * */
function organizeMessages(rawMessages) {
  var i18nMessages = {};
  rawMessages.forEach(row => {
    var lang = row.lang;
    var key = row.key;
    // 언어 없으면 객체 추가
    if (!i18nMessages.hasOwnProperty(lang)) {
      i18nMessages[lang] = {};
    }
    i18nMessages[lang][key] = row.message;
  });
  return i18nMessages;
}

/**
 * 다국어 DB 에서 가져오기
 * 가져와서 Vuei18n API 에 맞게 object 구성
 * */
async function getMessagesFromDatabase() {
  let response = await fetch(`${API_BASE_URL}/common/selectMessages`,  {mode: 'cors'});
  return await response.json().then(messages => {
    return organizeMessages(messages);
  }).catch(function (error) {
    console.log(error);
    router.push('/error');
  });
}

/**
 * Public API 영역
 * =======================================
 * */

// 공통 API
const i18nTest = {
  /**
   * 다국어 Message 로딩
   * */
  loadMessages(messages) {
    if (Object.prototype.toString.call(messages) !== "[object Object]") {
      throw new Error(`messages passed to loadMessages() must be an object`);
    }
    messageStore = messages;
  },
  async getRawMessagesFromDb() {
    let response = await fetch(`${API_BASE_URL}/common/selectMessages`);
    return await response.json();
  },
  async getMessagesFromDb() {
    return await getMessagesFromDatabase();
  },
  organizeMessages(messages) {
    return organizeMessages(messages);
  },
  getClonedMessages() {
    return deepCopy(messageStore);
  },
  getMessages() {
    return messageStore;
  },
  getMessage(key, lang) {
    lang = lang || getLanguage();
    if (lang in messageStore) {
      let messages = messageStore[lang];
      if (key in messages) {
        return messages[key];
      }
      throw new Error(`Cannot find message for key: ${key}`);
    }
    throw new Error(`Cannot find lang: ${lang}`);
  },
  getLang() {
    return getLanguage();
  },
  setLang(lang) {
    if (typeof lang !== "string" && lang.length !== 2) {
      throw new Error(`Language code must be length of two: ${lang}`);
    }
    language = lang;
  }
};

export {i18nTest}
