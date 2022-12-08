/** @jsxImportSource @emotion/react */
import * as style from "./styles";

interface CheckBoxProps {
  onChange: any;
}

const CheckBox = ({ onChange }: CheckBoxProps) => {
  return <input css={style.checkBoxStyle} type="checkbox" onChange={onChange} />;
};

export default CheckBox;
