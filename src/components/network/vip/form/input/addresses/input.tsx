
import { useState, forwardRef } from "react";
import { Row, Col, InputNumber, Button } from "antd";
import { Inputs } from 'library';

export type AddressInputProps = {
  value?: string;
  onChange?: (value: string) => void;
}

const AddressInput = forwardRef(({ value = "", onChange = () => null }: AddressInputProps, ref: any) => {
  if (typeof value === "object") value = "";
  const [type, setType] = useState(() => (value.includes('-') ? "range" : "cidr") as "range" | "cidr");
  if (value.includes('-') && type === "cidr") {
    setType("range")
  } else if (value.includes('/') && type === "range") {
    setType("cidr")
  }
  if (type === 'range') {
    const [ipstart, ipend] = value.split('-');
    console.log({ ipstart, ipend })
    return (
      <Row ref={ref}>
        <Col style={{ float: 'left', width: 'calc(50% - 28px)' }}>
          <Inputs.IP
            value={ipstart}
            placeholder="IP起始地址"
            onChange={v => onChange!(`${v.target.value}-${ipend}`)}
          />
        </Col>
        <Col style={{ float: 'left', width: 16, textAlign: 'center' }}>~</Col>
        <Col style={{ float: 'left', width: 'calc(50% - 28px)' }}>
          <Inputs.IP
            value={ipend}
            placeholder="IP结束地址"
            onChange={v => onChange!(`${ipstart}-${v.target.value}`)}
          />
        </Col>
        <Button style={{ float: 'right', margin: '4px 0' }} icon="swap" onClick={() => onChange(`${ipstart}/24`)} />
      </Row>
    )
  } else {
    const [ip, cidr = 24] = value.split('/');
    return (
      <Row ref={ref}>
        <Col style={{ float: 'left', marginRight: 8, width: 'calc(100% - 128px)' }}>
          <Inputs.IP
            value={ip}
            placeholder="节点IP起始地址"
            onChange={v => onChange!(`${v.target.value}/${cidr}`)}
          />
        </Col>
        <Col style={{ float: 'left', width: 80 }}>
          <InputNumber
            style={{ width: '100%' }}
            placeholder="cidr"
            value={Number(cidr)}
            onChange={v => onChange!(`${ip}/${v}`)}
          />
        </Col>
        <Button style={{ float: 'right', margin: '4px 0' }} icon="swap" onClick={() => onChange(`${ip}-${ip}`)} />
      </Row>
    )
  }
})

export default AddressInput;