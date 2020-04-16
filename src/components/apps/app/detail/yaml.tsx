import {Typography, Descriptions} from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {vs} from 'react-syntax-highlighter/dist/esm/styles/hljs';

export interface YamlProps {
  yaml: string;
}

const Yaml = ({yaml}: YamlProps) => {
  return (
    <Descriptions layout="vertical" bordered>
      <Descriptions.Item
        span={4}
        label={
          <Typography.Text copyable={{text: yaml}}>YAML信息</Typography.Text>
        }
      >
        <SyntaxHighlighter language="yaml" style={vs}>
          {yaml}
        </SyntaxHighlighter>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default Yaml;
