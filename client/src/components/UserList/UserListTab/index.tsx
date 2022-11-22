/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as style from "./styles";

export interface UserListTabProps {
  selected: number;
  setSelected: (value: number) => void;
}

const tabs = ["유저", "친구", "랭킹"];

const UserListTab = ({ selected, setSelected }: UserListTabProps) => {
  return (
    <ul css={style.TabContainerStyle}>
      {tabs.map((tabs, idx) => {
        return (
          <li
            key={idx}
            css={css`
              ${style.TabStyle}
              ${selected === idx ? style.SelectedTabStyle : style.UnSelectedTabStyle}
              ${style.TabBackgroundColorStyle[idx]}
            `}
            onClick={() => setSelected(idx)}
          >
            <p>{tabs}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default UserListTab;
