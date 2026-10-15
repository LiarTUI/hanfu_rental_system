import { Input } from 'antd';
import type { CustomInputProps } from './type';
export default function CustomInput(props: CustomInputProps) {
  return <Input {...props} />;
}
