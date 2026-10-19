import { Select } from 'antd';
import { getTextRenderWidth } from '../../util/measure';
import Input from '../Input';
import styles from './index.less';
import type { fromRenderProps } from './type';
export default function FormRender(props: fromRenderProps) {
  const { type, configs, label } = props;
  const showLable = (label: string) => {
    if (label) {
      let width = getTextRenderWidth(label);
      if (!width) width = 55;
      return (
        <div
          className={styles.formRenderLabel}
          style={{ minWidth: width + 10 }}
        >
          {label}:
        </div>
      );
    }
  };
  const formItem = () => {
    if (type === 'input') {
      return <Input {...configs} />;
    } else if (type === 'select') {
      return <Select {...configs} />;
    }
  };
  return (
    <div>
      {label ? showLable(label) : null}
      {formItem()}
    </div>
  );
}
