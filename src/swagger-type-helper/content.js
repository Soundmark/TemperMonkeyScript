GM_addStyle(`
.type-btn,.fn-btn{
  border-radius: 50px;
  position: fixed;
  right: 5px;
  font-size: 12px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  padding: 0 8px;
  z-index: 1000;
  color: #fff;
  font-weight: bold;
  transition: 0.3s;
  width: 35px;
  text-align: center;
  overflow: hidden;
}
.type-btn:hover,.fn-btn:hover{
  width: 80px;
  text-align: left;
}
.type-btn{
  background: #2f74c0;
  bottom: 100px;
}
.fn-btn{
  background: #FFC300;
  bottom: 55px;
}
.copy-textarea{
  position: fixed;
  z-index: 100;
  visibility: hidden  ;
  top: 0;
  left: 0;
}
.swal2-container .swal2-toast{
  padding: 4px 1em;
}
`);

const nameIndexMap = {
  0: "name",
  1: "description",
  2: "type",
  3: "remark",
};

const interceptor = {};

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
  const fnBtn = document.createElement("div");
  fnBtn.innerHTML = "Fn定义复制";
  fnBtn.className = "fn-btn";

  btn.onclick = () => {
    content.childNodes.forEach((item) => {
      if (item.attributes["aria-hidden"]?.value === "false") {
        const docTable = item.querySelectorAll(".ant-table-wrapper")[2];
        const body = docTable.querySelector(".ant-table-tbody");
        const arr = convertHtmlToArray(body);
        const complexTypeList = [];
        interceptor.onBeforeTypeCopy?.(arr);
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

  fnBtn.onclick = () => {
    const urlNode = document.querySelector(".knife4j-api-summary");
    const method = urlNode.childNodes[0].innerText;
    const url = urlNode.childNodes[1].innerText;
    const fnName = url.split("/").reverse()[0];
    const name = document.querySelector(".knife4j-api-copy-address")?.parentNode
      ?.childNodes[0].innerText;

    const obj = { url, method, name, fnName };
    interceptor.onBeforeFnCopy?.(obj);

    const fn = [
      `/** ${obj.name} */`,
      `export const use${obj.fnName[0].toUpperCase()}${obj.fnName.slice(
        1
      )} = () => useService(`,
      `  {`,
      `    url: '${obj.url.match(/\/web.+/)}',`,
      `    method: '${obj.method.toLowerCase()}',`,
      `  }`,
      `)`,
    ];
    GM_setClipboard(fn.join("\n"));
    Swal.fire({
      position: "top",
      toast: true,
      showConfirmButton: false,
      timer: 1000,
      icon: "success",
      title: "复制Fn定义成功",
    });
  };

  content.appendChild(btn);
  content.appendChild(fnBtn);
  observer.disconnect();
});

observer.observe(document.body, { childList: true });
