import services from '@/services/demo';
import {
  ActionType,
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';


const { queryApplications } =
services.ApplicationController;


const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProDescriptionsItemProps<API.AppItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: 'AppId',
      dataIndex: 'AppId',
      valueType: 'text',
      render(_, record) {
        return <Button type="link" onClick={() => history.push(`/application/${record.AppId}`)}>{record.AppId}</Button>
      }
    },
    {
      title: 'AuthorizationCode',
      dataIndex: 'AuthorizationCode',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: 'appSecret',
      dataIndex: 'appSecret',
      valueType: 'text',
      hideInSearch: true
    },

  ];

  return (
    <PageContainer
      header={{
        title: '小程序列表',
      }}
    >
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params, sorter, filter) => {
          const { data } = await queryApplications({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.list || [],
            total: data?.total || 0,
            success: true,
          };
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
