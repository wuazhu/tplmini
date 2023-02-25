import services from '@/services/demo';
import {
  ActionType,
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import { FormValueType } from './components/UpdateForm';

const { 
  addCompany, queryCompanies,
  } =
  services.CompanyController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  console.log('添加参数', fields);
  
  const hide = message.loading('正在添加');
  try {
    await addCompany({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      tip: 'id是唯一的 key',
      hideInForm: true,
      hideInSearch: true
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: '公司列表',
      }}
    >
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, total } = await queryCompanies({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.list || [],
            total: total,
            success: true,
          };
        }}
        columns={columns}
      />
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      
    </PageContainer>
  );
};

export default TableList;
