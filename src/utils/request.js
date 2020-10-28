// 封装axios .定义拦截器
import axios from "axios";

// 定义一个信息对象
const messages = {
  401: "没有权限",
  403: "禁止访问",
  404: "找不到地址",
};

// 默认地址路径为当前首页
const request = axios.create({
  baseURL: "/",
});

// 先触发请求拦截器 - 发送请求 - 响应拦截器 - 触发then/catch/await
// 请求拦截器（设置公共的请求参数、请求头）
request.interceptors.request.use((config) => {
  // config 是请求的所有信息
  return config;
});

// 响应拦截器（1. 判断响应具体是成功还是失败 2. 返回更加具体的错误提示）
request.interceptors.response.use(
  // 看响应状态码决定响应成功，失败
  // 响应成功2xx

  (response) => {
    // 请求成功 、响应成功并不代表功能成功
    // 功能是否成功，看响应结果的code
    // code是20000才是功能成功，非20000就是功能失败
    // response.data代表响应数据
    if (response.data.code === 20000) {
      // 功能成功  ----返回成功的数据
      return response.data.data;
    } else {
      // 功能失败
      return Promise.reject(response.data.message);
    }
  },
  // 响应失败
  (error) => {
    let message = "未知错误，请联系管理员解决！";
    if (error.message) {
      // 服务器返回了响应。但是响应失败
      //401 未授权
      //404 找不到地址   403 禁止访问   500服务器内部出错
      // 在提示信息内定义数组，可以引用多个错误信息
      if (messages[error.response.status]) {
        message = messages[error.response.status];
      }
    } else {
      // 服务器没有返回响应
      // 请求超时还是网络错误
      if (error.message.indexOf("NetWork Err")) {
        message = "暂无网络，请打开网络连接";
      } else if (error.message.indexOf("timeOut")) {
        message = "网络延迟，请打开数据网络/wifi 试试";
      }
    }
    return Promise.reject(message);
  }
);
export default request;
