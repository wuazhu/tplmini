/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 获取小程序列表 GET /api/app */
export async function queryApplications(
  params: {
    // query
    /** keyword */
    keyword?: string;
    /** current */
    current?: number;
    /** pageSize */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.TableListResult>('/app', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取小程序详情 GET /api/app/appid */
export async function queryAppInfo(
  appid: string,
  options?: { [key: string]: any },
) {
  return request<API.TableListResult>(`/app/${appid}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 上传新版本 */
export async function uploadApp(
  appid: string,
  data: {
    template_id: number;
    user_desc: string;
    user_version: string;
  }
) {
  return request<API.Result_UserInfo_>(`/app/upload/${appid}`, {
  method: 'POST',
  data,
  headers: {
      'Content-Type': 'application/json',
    },
  });
}
/** 提审代码 */
export async function auditApp(
  appid: string,
) {
  return request<API.Result_UserInfo_>(`/app/audit/${appid}`, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 发布代码 */
export async function releaseApp(
  appid: string,
) {
  return request<API.Result_UserInfo_>(`/app/release/${appid}`, {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
    },
  });
}

/** 小程序二维码 */
export async function getQrcode(
  appid: string,
  data: {
    version?: string;
    path?: string;
  }
) {
  return request<API.Result_UserInfo_>(`/app/qrcode/${appid}`, {
  // method: 'POST',
  data,
  responseType: 'stream',
  headers: {
      'Content-Type': 'application/json',
    },
  });
}
