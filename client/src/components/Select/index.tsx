/** @jsxImportSource @emotion/react */
import * as style from "./styles";

export interface SelectProps {
  SelectType: "게임 필터" | "게임 생성" | "인원 제한";
}

const Select = ({ SelectType }: SelectProps) => {
  switch (SelectType) {
    case "게임 필터":
      return (
        <div css={style.selectWrapper}>
          <select css={style.selectBox}>
            <option>모든 게임</option>
            <option value="catchMind">캐치 마인드</option>
            <option value="battleShip">배틀십</option>
          </select>
        </div>
      );

    case "게임 생성":
      return (
        <div css={style.selectWrapper}>
          <select css={style.selectBox}>
            <option>게임을 선택해 주세요.</option>
            <option value="catchMind">캐치 마인드</option>
            <option value="battleShip">배틀십</option>
          </select>
        </div>
      );

    case "인원 제한":
      return (
        <div css={style.selectWrapper}>
          <select css={style.selectBox}>
            <option>인원을 선택해 주세요.</option>
            <option value="4">4명</option>
            <option value="8">8명</option>
          </select>
        </div>
      );
  }
};

export default Select;
