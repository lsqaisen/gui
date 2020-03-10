import {useRef, useLayoutEffect, useState, useEffect} from 'react';
import * as G6 from '@antv/g6';
import shape from './shape';
import {INs} from '@/models/apps/namespace';
import {IApp, IService} from '@/models/apps/apps';
import {IIngress} from '@/models/apps/ingress';
import {INlb} from '@/models/apps/nlb';

export interface TopologyProps {
  ns: INs;
  apps: IApp[];
  services: IService[];
  ingresses: IIngress[];
  nlblist: INlb[];
}

const Topology = ({
  ns,
  apps,
  services = [],
  ingresses = [],
  nlblist = [],
}: TopologyProps) => {
  let nodes: any[] = [],
    edges: any[] = [];
  const app_nodes = apps.map(v => ({
      id: `app_${v.name}`,
      name: v.name,
      type: 'app',
      typeinfo: `应用`,
      info: ({
        Deployment: '可扩展的部署Pod',
        DaemonSet: '在每个主机上运行Pod',
        StatefulSet: '有状态集的运行Pod',
      } as any)[v.type],
      active: v.ready === v.replicas,
      status: `Pod: ${v.ready} / ${v.replicas}`,
      data: v,
    })),
    service_nodes = (
      services.filter(
        v =>
          nlblist.some(n => v.name === n.app_name) ||
          ingresses.some(i => i.rules.some(r => r.service === v.name))
      ) || []
    ).map(v => ({
      id: `service_${v.name}`,
      name: v.name,
      type: 'service',
      typeinfo: `服务`,
      info: v.type,
      active: true,
      status: v.type,
      data: v,
    }));
  // nodes = nodes.concat(service_nodes);
  nodes = nodes.concat(app_nodes);
  nodes = nodes.concat(
    nlblist.map(n => ({
      id: `nlb_${n.name}`,
      name: n.name,
      type: 'nlb',
      typeinfo: `网络负载`,
      info: `应用服务:${n.app_name}`,
      active: true,
      status: n.ip,
      data: n,
    }))
  );
  nlblist.forEach(nlb => {
    nodes = nodes.concat(
      (nlb.ports || []).map(port => {
        edges.push({
          source: `rule_${JSON.stringify(port)}`,
          target: `nlb_${nlb.name}`,
        });
        edges.push({
          source: `app_${app_nodes.find(v => v.name === nlb.app_name)!.name}`,
          target: `rule_${JSON.stringify(port)}`,
        });
        // if (service_nodes.some(v => v.name === nlb.app_name)) {
        //   edges.push({
        //     source: `service_${
        //       service_nodes.find(v => v.name === nlb.app_name)!.name
        //     }`,
        //     target: `rule_${JSON.stringify(port)}`,
        //   });
        //   edges.push({
        //     source: `app_${nodes.find(v => v.name === nlb.app_name)!.name}`,
        //     target: `service_${
        //       service_nodes.find(v => v.name === nlb.app_name)!.name
        //     }`,
        //   });
        // } else if (app_nodes.some(v => v.name === nlb.app_name)) {
        //   edges.push({
        //     source: `app_${app_nodes.find(v => v.name === nlb.app_name)!.name}`,
        //     target: `rule_${JSON.stringify(port)}`,
        //   });
        // }
        return {
          id: `rule_${JSON.stringify(port)}`,
          name: `${port.protocol}:${port.port}->${port.target_port}`,
          type: 'rule',
          typeinfo: '转发规则',
          active: true,
          // status: port.protocol,
        };
      })
    );
  });
  nodes = nodes.concat(
    ingresses.map(i => ({
      id: `ingress_${i.name}`,
      name: i.name,
      type: 'ingress',
      typeinfo: `应用负载`,
      info: `${i.listen_https ? '启用HTTPS,' : ''}${
        i.secret ? `证书：${i.secret},` : ''
      }${i.network_type === 'public' ? '公网' : '内网'} `,
      active: true,
      status: i.ip,
      data: i,
    }))
  );
  ingresses.forEach(ingress => {
    nodes = nodes.concat(
      ingress.rules.map(rule => {
        const name = `${rule.host || '#VIP'}://${rule.path}:${
            rule.protocol.toLocaleUpperCase() === 'HTTP' ? '80' : '443'
          }->${rule.port}`,
          id = `rule_${JSON.stringify(rule)}`;
        edges.push({
          source: `rule_${JSON.stringify(rule)}`,
          name: id,
          target: `ingress_${ingress.name}`,
        });
        edges.push({
          source: `app_${app_nodes.find(v => v.name === rule.service)!.name}`,
          target: id,
        });
        // if (service_nodes.some(v => v.name === rule.service)) {
        //   edges.push({
        //     source: `service_${
        //       service_nodes.find(v => v.name === rule.service)!.name
        //     }`,
        //     target: id,
        //   });
        //   edges.push({
        //     source: `app_${nodes.find(v => v.name === rule.service)!.name}`,
        //     target: `service_${
        //       service_nodes.find(v => v.name === rule.service)!.name
        //     }`,
        //   });
        // } else if (app_nodes.some(v => v.name === rule.service)) {
        //   edges.push({
        //     source: `app_${app_nodes.find(v => v.name === rule.service)!.name}`,
        //     target: id,
        //   });
        // }
        return {
          id,
          name: name,
          type: 'rule',
          typeinfo: '转发规则',
          active: true,
          // status: rule.protocol,
        };
      })
    );
  });

  const containerRef = useRef(null);
  const graphRef: {current?: G6.Graph} = useRef();
  const data = {nodes, edges};
  useEffect(() => {
    if (graphRef.current && nodes.length > 0) {
      graphRef.current.read(data);
    }
  }, [JSON.stringify(ns || {}), JSON.stringify(apps || [])]);
  useLayoutEffect(() => {
    graphRef.current = shape(containerRef.current!);
    if (nodes.length > 0) {
      graphRef.current.data(data);
      graphRef.current.render();
    }
  }, []);
  return <div style={{width: '100%', height: '100%'}} ref={containerRef}></div>;
};

export default Topology;
