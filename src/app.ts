import type {RequestConfig} from '@umijs/max'
import {message} from 'antd'
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

// 请求配置
export const request: RequestConfig = {
  // baseURL: '/api',
  baseURL: process.env.NODE_ENV == 'development'?'/api':'https://springboot-5buc-2104279-1309439117.ap-shanghai.run.tcloudbase.com',
  timeout: 30000,
  // other axios options you want
  errorConfig: {
    errorHandler(err){
      console.log('出错的请求', err);
      const {code, errorMsg} = err.response.data
      if (code >= 500) {
        message.error(errorMsg || '请求出错了!')
      }
      return err.response
    },
  },
  requestInterceptors: [
    (config) => {
      // console.log('config', config);
      
      return config
    }
  ],
  responseInterceptors: [
    (response) =>
      {
        // 不再需要异步处理读取返回体内容，可直接在data中读出，部分字段可在 config 中找到
        const { data = {} as any, config } = response;
        // console.log('res', response);
        return response
      },
  ]
};