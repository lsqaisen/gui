
import makeDrawerForm from "./";
import { Form, Input } from "antd";

const FormComp = Form.create()(
  () => (
    <Form>
      <Form.Item>
        <Input />
      </Form.Item>
    </Form>
  )
)

export default makeDrawerForm(FormComp);