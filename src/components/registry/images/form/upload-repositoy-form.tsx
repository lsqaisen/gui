import { PureComponent } from 'react';
import { Form } from 'antd';
import FileInput, { FileInputProps } from './input/file-input';
import InternalInput, { InternalInputProps } from './input/internal-input';
import ExternalInput, { ExternalInputProps } from './input/external-input';
import styles from './style/index.less';

export interface UploadRepositoyFormProps extends FileInputProps, InternalInputProps, ExternalInputProps {
  type?: 'file' | 'internal' | 'external';
}

@(Form.create() as any)
class AddProjectForm extends PureComponent<UploadRepositoyFormProps, any> {
  render() {
    const { type, admin, namespace, username, searchProjects, ...props } = this.props;
    return (
      <Form className={styles.ekos_upload_image} id="upload">
        {type === 'file' ? (
          <FileInput  {...{ admin, namespace, searchProjects, ...props }} />
        ) : type === 'internal' ? (
          <InternalInput ref="input" username={username} />
        ) : (
              <ExternalInput ref="input" username={username} />
            )}
      </Form>
    )
  }
}

export default AddProjectForm;