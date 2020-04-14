import { Fragment } from 'react';
import { Typography } from 'antd';
import ReactJson from 'react-json-view'
import Description from './description';
import { Status } from "library";

const { Title, Paragraph } = Typography;

export interface ContainersProps {
  data: any[];
}

interface BasicTypes {
  [key: string]: string;
}

const basicTypes: BasicTypes = {
  command: "命令",
  cpuPercent: "CPU占比",
  image: "镜像",
  memPercent: "内存占比",
  name: "名称",
  phase: "状态",
  restartCount: "重启次数",
}

const healthCheckTypes: BasicTypes = {
  protocol: "协议",
  exec: "命令", //command
  // httpGet: { path: "", port: 0, host: "", scheme: "", httpHeaders: null }
  initialDelaySeconds: "初始化延时",
  periodSeconds: "检测间隔",
  timeoutSeconds: "timeoutSeconds",
  successThreshold: "健康阈值",
  failureThreshold: "故障阈值"
}

export default ({ data = [] }) => {
  return (
    <Typography style={{ padding: '0 8px' }}>
      {data.map((container: any) => (
        <Fragment key={container.name}>
          <Title level={2}>{container.name}</Title>
          <Title level={4}>基础信息</Title>
          <Paragraph>
            {Object.entries(container || {}).map(([key, value]) => {
              if (typeof value === 'string' || typeof value === 'number') {
                return (
                  <Description
                    key={key}
                    span={24}
                    term={basicTypes[`${key}`]}
                  >
                    {key === "phase" ? <div style={{ width: 80 }}>
                      <Status status={value as any} text={value as any} />
                    </div> : value === undefined || value === null ? "--" : value}
                  </Description>
                )
              }
            })}
          </Paragraph>
          <Title level={4}>健康检查</Title>
          <Paragraph>
            {!(!container.healthCheck ||
              !container.healthCheck.protocol ||
              container.healthCheck.protocol === "NONE") ? (
                <Fragment>
                  <Description span={24} term="协议" >
                    {container.healthCheck.protocol}
                  </Description>
                  {container.healthCheck.protocol === 'TCP' ? (
                    <Description span={24} term="端口" >
                      {container.healthCheck.tcpSocket.port}
                    </Description>
                  ) : container.healthCheck.protocol === 'HTTP' ? (
                    <Description span={24} term="检测地址">
                      {container.healthCheck.httpGet.host}:{container.healthCheck.httpGet.port}{container.healthCheck.httpGet.path}
                    </Description>
                  ) : (
                        <Description span={24} term="检测命令">
                          {container.healthCheck.exec.command || '--'}
                        </Description>
                      )}
                  <Description span={24} term="初始化延时">
                    {container.healthCheck.initialDelaySeconds}秒
                  </Description>
                  <Description span={24} term="检测间隔">
                    {container.healthCheck.periodSeconds}秒
                  </Description>
                  <Description span={24} term="响应时限">
                    {container.healthCheck.timeoutSeconds}秒
                  </Description>
                  <Description span={24} term="健康阈值">
                    {container.healthChecksuccessThreshold}秒
                  </Description>
                  <Description span={24} term="故障阈值">
                    {container.healthCheck.failureThreshold}秒
                  </Description>
                </Fragment>
              ) : "未开启"}
          </Paragraph>
        </Fragment>
      ))}
      <Title level={4}>详细数据</Title>
      <Paragraph>
        <ReactJson
          name={false}
          src={data}
          theme="google"
          iconStyle="square"
          collapsed={2}
          displayDataTypes={false}
        />
      </Paragraph>
    </Typography>
  )
}