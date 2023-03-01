import services from '@/services/demo';
import {
  PageContainer, ProDescriptions, ProCard, ProForm, ProFormText, ProFormDigit
} from '@ant-design/pro-components';
import { Typography, message,Modal, Avatar, Row, Space, Col, Button, Image } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs'
import { useParams } from '@umijs/max';
const {Text, Title} = Typography
const { queryAppInfo, uploadApp, auditApp, releaseApp, getQrcode } = services.ApplicationController;

// type routerParams = {appid:string}

const TableList: React.FC<unknown> = () => {

  const params= useParams()
  const [info, setInfo] = useState({})
  const [latestQrCode, setLatestQrCode] = useState()
  const [showModal, setShowModal] = useState(false)
  const [versionInfo, setVersionInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const {appid} = params
  useEffect(() => {
    console.log('canshu', params)
    getAppBaseInfo()
    getQrCode()
  }, [appid])
  
  const arrayBufferToBase64 =(buffer) =>{
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const getQrCode = async () => {
    const _qrcode = await getQrcode(appid, {
      version: 'latest'
    })

    // let blob = new Blob([_qrcode], { type: _qrcode.type });
    // let url = URL.createObjectURL(blob);
    // if (_qrcode.code == 0) {
      // const url = arrayBufferToBase64(_qrcode)
      setLatestQrCode(_qrcode)
    // }
    // const url = window.URL.createObjectURL(_qrcode)
    // let r = window.btoa(
    //   new Uint8Array(_qrcode).reduce((d, byte) => d + String.fromCharCode(byte), '')
    // )
    // const url = 'data:image/png;base64,' + r;
    console.log('获取到的二维码',_qrcode)

  }

  const getAppBaseInfo = async () => {
    setLoading(true)
    const res = await queryAppInfo(appid)
    setLoading(false)
    if (res.code == 0) {
      setInfo(res.data.data)
      setVersionInfo({
        current: res.data.current,
        audit: res.data.audit,
        latest: res.data.latest,
      })
    }
  }
  const auditVersion = async () => {
    const res = await auditApp(appid)
    console.log('提审结果', res)
  }

  const releaseAppToDy = async () => {
    const res = await releaseApp(appid)
    console.log('提审结果', res)
  }
  
  
  return (
    <PageContainer
      title={false}
      loading={loading}
    >
      <ProCard title="小程序详情"
        hoverable gutter={0} direction="column" style={{ marginBlockStart: 0 }}>
        <ProCard title="基本信息">
          <Row gutter={20} align="middle" style={{marginBottom: 20}}>
            <Col><Avatar size={70} src={info.app_icon}></Avatar></Col>
            <Col>
              <Title style={{margin: 5}} level={3}>{info.app_name}</Title>
              <Text type="secondary">简介: {info.app_intro}</Text>
            </Col>
          </Row>
          {}
          <ProDescriptions
            column={2}>
            {/* <ProDescriptions.Item valueType="option">
              <Button key="primary" type="primary">
                提交
              </Button>
            </ProDescriptions.Item> */}
            <ProDescriptions.Item span={2} valueType="text" ellipsis label="appId" copyable>
              {info.app_id}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" ellipsis label="类目">
              <Space>
              {
                info && info.app_categories_audit_info && info.app_categories_audit_info.map(cate => <Text key={cate.app_category}>{cate.app_category_name}</Text>)
              }
              </Space>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="应用类型"
              valueEnum={{
                1: {
                  text: '小程序',
                  status: 'Success',
                },
                2: {
                  text: '小游戏',
                  status: 'Error',
                },
              }}
            >{info.app_type}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="小程序状态"
              valueEnum={{
                0: { text: '未发布', status: 'Default' },
                1: {
                  text: '已发布',
                  status: 'Success',
                },
                2: {
                  text: '已下线',
                  status: 'Error',
                },
              }}
            >{info.app_state}
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>
        <ProCard title="版本信息" subTitle="线上版本">
          {
            versionInfo.current && 
            <ProDescriptions
              column={2}>
              <ProDescriptions.Item valueType="text" ellipsis label="版本号">
                {versionInfo.current && versionInfo.current.version}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="date" fieldProps={{
                format: 'YYYY/MM/DD hh:mm:ss',
              }} label="创建时间">
                {dayjs(versionInfo.current && versionInfo.current.ctime*1000)}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label="是否下架"
                valueEnum={{
                  0: { text: '未下架', status: 'Success' },
                  1: {
                    text: '已下架',
                    status: 'Error',
                  },
                }}
              >{versionInfo.current && versionInfo.current.has_down}
              </ProDescriptions.Item>
              {versionInfo.current && versionInfo.current.summary && <ProDescriptions.Item valueType="text" ellipsis label="版本更新信息">
                {versionInfo.current.summary}
              </ProDescriptions.Item>}
              <ProDescriptions.Item span={12} valueType="text" ellipsis label="类目">
                <Space>
                {
                  versionInfo && versionInfo.current && versionInfo.current.categories.map(cate => <Text key={cate}>{cate}</Text>)
                }
                </Space>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="发布者">
                <Row align="middle">
                  <Col><Avatar src={versionInfo.current && versionInfo.current.developer_avatar}/></Col>
                  <Col>{versionInfo.current && versionInfo.current.developer_id}</Col>
                </Row>
              </ProDescriptions.Item>
            </ProDescriptions>
          }
        </ProCard>
        <ProCard title="版本信息" subTitle="审核版本" extra={
            versionInfo.audit && versionInfo.audit.status == 1 && versionInfo.audit.has_publish == 0 && <Button type="primary" onClick={releaseAppToDy}>发布</Button>
        }>
          {
            versionInfo.audit && 
            <ProDescriptions
              column={2}>
              <ProDescriptions.Item valueType="text" ellipsis label="版本号">
                {versionInfo.audit && versionInfo.audit.version}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="date" fieldProps={{
                format: 'YYYY/MM/DD hh:mm:ss',
              }} label="创建时间">
                {dayjs(versionInfo.audit && versionInfo.audit.ctime*1000)}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label="审核状态"
                valueEnum={{
                  0: { text: '审核中', status: 'Default' },
                  1: {
                    text: '通过',
                    status: 'Success',
                  },
                  2: {
                    text: '不通过',
                    status: 'Error',
                  },
                  3: {
                    text: '撤回审核',
                    status: 'Warning',
                  },
                }}
              >{versionInfo.audit && versionInfo.audit.status}
              </ProDescriptions.Item>
              {versionInfo.audit && versionInfo.audit.summary && <ProDescriptions.Item valueType="text" ellipsis label="版本更新信息">
                {versionInfo.audit.summary}
              </ProDescriptions.Item>}
              <ProDescriptions.Item span={12} valueType="text" ellipsis label="类目">
                <Space>
                {
                  versionInfo && versionInfo.audit && versionInfo.audit.categories.map(cate => <Text key={cate}>{cate}</Text>)
                }
                </Space>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="发布者">
                <Row align="middle">
                  <Col><Avatar src={versionInfo.audit && versionInfo.audit.developer_avatar}/></Col>
                  <Col>{versionInfo.audit && versionInfo.audit.developer_id}</Col>
                </Row>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="是否已经发布"
                valueEnum={{
                  0: { text: '未发布', status: 'Error' },
                  1: {
                    text: '已发布',
                    status: 'Success',
                  },
                }}>{versionInfo.audit.has_publish}</ProDescriptions.Item>
              <ProDescriptions.Item label="审核不通过原因">{versionInfo.audit && versionInfo.audit.reason || '-'}</ProDescriptions.Item>
            </ProDescriptions>
          }
        </ProCard>
        <ProCard title="版本信息" subTitle="测试版本" extra={
          <Space>
            <Button type="primary" onClick={() => setShowModal(true)}>新版本</Button>
            {
              versionInfo.latest && versionInfo.latest.has_audit == 0 && <Button type="primary" onClick={auditVersion}>提审</Button>
            }
          </Space>
        }>
          {
            versionInfo.latest && 
            <ProDescriptions
              column={2}>
              <ProDescriptions.Item valueType="text" ellipsis label="版本号">
                {versionInfo.latest.version}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="date" fieldProps={{
                format: 'YYYY/MM/DD hh:mm:ss',
              }} label="创建时间">
                {dayjs(versionInfo.latest.ctime*1000)}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label="是否已经提审"
                valueEnum={{
                  0: { text: '未提审', status: 'Error' },
                  1: {
                    text: '已提审',
                    status: 'Success',
                  },
                }}
              >{versionInfo.latest && versionInfo.latest.has_audit}
              </ProDescriptions.Item>
              {versionInfo.latest.summary && <ProDescriptions.Item valueType="text" ellipsis label="版本更新信息">
                {versionInfo.latest.summary}
              </ProDescriptions.Item>}
              <ProDescriptions.Item span={12} valueType="text" ellipsis label="类目">
                <Space>
                {
                  versionInfo && versionInfo.audit && versionInfo.audit.categories.map(cate => <Text key={cate}>{cate}</Text>)
                }
                </Space>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="发布者">
                <Row align="middle">
                  <Col><Avatar src={versionInfo.audit && versionInfo.audit.developer_avatar}/></Col>
                  <Col>{versionInfo.audit && versionInfo.audit.developer_id} </Col>
                </Row>
              </ProDescriptions.Item>
              <ProDescriptions.Item label="二维码">
                {latestQrCode && <img src={latestQrCode} />}
              </ProDescriptions.Item>
            </ProDescriptions>
          }
        </ProCard>
      </ProCard>
      <Modal
        destroyOnClose
        title="提交代码"
        width={420}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <ProForm
          onFinish={async (val) => {
            console.log('内容',val);
            const uplRes = await uploadApp(appid, val)
            console.log('上次结果', uplRes)
            if (uplRes.code == 0) {
              message.success('提交成功')
              setShowModal(false)
            } else {
              message.warning(uplRes.data.message || '提交失败')
            }
          }}>
          <ProFormDigit label="模板ID" name="template_id" rules={[{required: true, message: '请输入模板id'}]} />
          <ProFormText
            width="md"
            name="user_desc"
            label="提交描述"
            placeholder="请输入"
            rules={[{required: true, message: '请输入提交描述'}]} 
          />
          <ProFormText
            width="md"
            name="user_version"
            label="提交版本"
            placeholder="请输入"
            rules={[{required: true, message: '请输入版本号'}]} 
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default TableList;
