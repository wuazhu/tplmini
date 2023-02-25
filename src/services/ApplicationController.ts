/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

/** 获取企业列表 GET /api/company */
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

/** 此处后端没有提供注释 POST /api/v1/user */
export async function addCompany(
  body?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>('/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
