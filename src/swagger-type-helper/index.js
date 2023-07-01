// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*/doc.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/sweetalert2
// ==/UserScript==

GM_addStyle(`
.type-btn{
  background: #2f74c0;
  border-radius: 50px;
  position: fixed;
  right: -55px;
  bottom: 100px;
  font-size: 12px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  padding: 0 8px;
  z-index: 1000;
  color: #fff;
  font-weight: bold;
  transition: 0.3s;
}
.type-btn:hover{
  right: 0px
}
.copy-textarea{
  position: fixed;
  z-index: 100;
  visibility: hidden  ;
  top: 0;
  left: 0;
}
`);

const nameIndexMap = {
  0: "name",
  1: "description",
  2: "type",
  3: "remark",
};

const convertHtmlToArray = (node, arr = []) => {
  node.childNodes.forEach((item1) => {
    // row
    const obj = {};
    item1.childNodes.forEach((item2, index2) => {
      // col
      const target = item2.childNodes[item2.childNodes.length - 1];
      obj[nameIndexMap[index2]] = target?.innerText || target?.textContent;
      if (index2 === 0) {
        const firstChild = item2.childNodes[0];
        const pl = parseInt(
          firstChild?.style?.paddingLeft?.replace("px", "") || 0
        );
        obj.level = pl / 20;
      }
    });
    if (!["data", "retCode", "retMsg"].includes(obj.name)) {
      obj.type = obj.type.replace(/\(.*\)/, "").replace("integer", "number");
      arr.push(obj);
    }
  });
  return arr;
};

const observer = new MutationObserver(() => {
  const content = document.querySelector(".ant-tabs-content");
  const typeBtn = document.querySelector(".type-btn");
  if (!content || typeBtn) return;
  const btn = document.createElement("div");
  btn.innerHTML = "TS类型复制";
  btn.className = "type-btn";

  btn.onclick = () => {
    content.childNodes.forEach((item) => {
      if (item.attributes["aria-hidden"]?.value === "false") {
        const docTable = item.querySelectorAll(".ant-table-wrapper")[2];
        const body = docTable.querySelector(".ant-table-tbody");
        const arr = convertHtmlToArray(body);
        const complexTypeList = [];
        let text = arr.reduce((acc, cur, index) => {
          const pre = new Array(cur.level).fill("  ").join("");
          if (
            complexTypeList.length &&
            cur.level === complexTypeList[0].level
          ) {
            acc += `${pre}${complexTypeList[0].end}`;
            complexTypeList.shift();
          }
          acc += `${pre}/** ${cur.description} */\n`;
          if (cur.type === "array") {
            if (
              arr[index + 1] !== undefined &&
              arr[index + 1].level > cur.level
            ) {
              acc += `${pre}${cur.name}: {\n`;
              complexTypeList.unshift({ end: "}[];\n", level: cur.level });
            } else {
              acc += `${pre}${cur.name}: any[];\n`;
            }
          } else if (cur.type === "object") {
            if (
              arr[index + 1] !== undefined &&
              arr[index + 1].level > cur.level
            ) {
              acc += `${pre}${cur.name}: {\n`;
              complexTypeList.unshift({ end: "};\n", level: cur.level });
            } else {
              acc += `${pre}${cur.name}: Record<string, any>;\n`;
            }
          } else {
            acc += `${pre}${cur.name}: ${cur.type};\n`;
          }
          return acc;
        }, "");
        if (complexTypeList.length) {
          text += "  " + complexTypeList[0].end;
        }
        const type = "export interface IDataParam {\n" + text + "}";
        GM_setClipboard(type);
        console.log(type);
        Swal.fire({
          position: "top",
          toast: true,
          showConfirmButton: false,
          timer: 1000,
          icon: "success",
          title: "复制类型成功",
        });
      }
    });
  };
  content.appendChild(btn);
  observer.disconnect();
});

observer.observe(document.body, { childList: true });
