# swagger-type-helper

用于根据 swagger 接口快速生成 typescript 类型定义和请求函数定义

## 用法

[点击安装](https://github.com/Soundmark/TemperMonkeyScript/raw/main/src/swagger-type-helper/index.user.js)

> 注意：需要安装油猴插件

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
