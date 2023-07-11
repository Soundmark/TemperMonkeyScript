// ==UserScript==
// @name         Swagger Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速生成swagger接口的typescript定义
// @author       郑家豪
// @match        *://*/*/doc.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/sweetalert2
// @require      https://raw.githubusercontent.com/Soundmark/TemperMonkeyScript/main/src/swagger-type-helper/content.js
// ==/UserScript==

// type arr = {description: string; level: number; name: string; remark: string; type: string;}[]
interceptor.onBeforeTypeCopy = (arr) => {};

// type obj = {url: string; method: 'GET' | 'POST'; name: string; fnName: string}
interceptor.onBeforeFnCopy = (obj) => {};
