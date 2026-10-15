import Input from '../Input';
import type { fromRenderProps } from './type';
export default function FormRender(props: fromRenderProps) {
  const { type, configs } = props;
  const formItem = () => {
    if (type === 'input') {
      return <Input {...configs} />;
    }
  };
  return <div>{formItem()}</div>;
}
