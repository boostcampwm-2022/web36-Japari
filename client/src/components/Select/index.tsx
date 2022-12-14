/** @jsxImportSource @emotion/react */
import * as style from "./styles";
import { css } from "@emotion/react";
import { ChangeEvent } from "react";

export interface SelectProps {
  selectType: "게임 필터" | "게임 생성" | "인원 제한" | "공개방 설정";
  width?: string;
  setValue: (value: any) => void;
}

const Select = ({ selectType, width, setValue }: SelectProps) => {
  const handlePrivateSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "private") {
      setValue(true);
    } else {
      setValue(false);
    }
  };

  switch (selectType) {
    case "게임 필터":
      return (
        <div css={style.selectWrapper}>
          <select
            css={css`
              ${style.selectBox}
              width: ${width};
            `}
            onChange={e => setValue(Number(e.target.value))}
            defaultValue={0}
          >
            <option value={0}>모든 게임</option>
            <option value={1}>캐치 마인드</option>
          </select>
        </div>
      );

    case "게임 생성":
      return (
        <div css={style.selectWrapper}>
          <select
            css={css`
              ${style.selectBox}
              width: ${width};
            `}
            onChange={e => setValue(Number(e.target.value))}
            defaultValue={0}
          >
            <option value={0} disabled>
              게임을 선택해 주세요.
            </option>
            <option value={1}>캐치 마인드</option>
          </select>
        </div>
      );

    case "인원 제한":
      return (
        <div css={style.selectWrapper}>
          <select
            css={css`
              ${style.selectBox}
              width: ${width};
            `}
            onChange={e => setValue(Number(e.target.value))}
            defaultValue={0}
          >
            <option disabled value={0}>
              인원을 선택해 주세요.
            </option>
            <option value={4}>4명</option>
            <option value={8}>8명</option>
          </select>
        </div>
      );

    case "공개방 설정":
      return (
        <div css={style.selectWrapper}>
          <select
            css={css`
              ${style.selectBox}
              width: ${width};
            `}
            defaultValue={"public"}
            onChange={handlePrivateSelect}
          >
            <option value="public">공개방</option>
            <option value="private">비공개방</option>
          </select>
        </div>
      );
  }
};

export default Select;
