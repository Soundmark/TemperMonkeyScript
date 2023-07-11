# swagger-type-helper

用于根据 swagger 接口快速生成 typescript 类型定义和请求函数定义

## 用法

1. 新建 temper monkey 脚本
2. 将`index.js`内容复制到新建脚本中(覆盖新建脚本中的默认内容)
3. 保存脚本，到 swagger 网页中刷新，如果右下角出现按钮则说明脚本生效

## api

### interceptor.onBeforeTypeCopy

复制类型前的回调

类型

```ts
type OnBeforeTypeCopy = (arr: TypeArr) => void;

// 类型信息数组
type TypeArr = {
  // 字段描述
  description: string;
  // 等级
  level: number;
  // 字段名
  name: string;
  // 字段备注
  remark: string;
  // 字段类型
  type: string;
}[];
```

### interceptor.onBeforeFnCopy

复制请求函数定义前的回调

类型

```ts
type OnBeforeFnCopy = (obj: FnInfo) => void;

type FnInfo = {
  // 接口地址
  url: string;
  // 请求方法
  method: "GET" | "POST";
  // 接口名(描述)
  name: string;
  // 函数命名
  fnName: string;
};
```

> 如果有更进一步修改的需求，可直接将`content.js`中的内容也复制到 temper monkey 脚本中，删除脚本引入代码，删除 interceptor 回调代码即可
