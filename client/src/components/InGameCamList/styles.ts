import { css } from "@emotion/react";
import { theme } from "../../styles/theme";

export const inGameCamListStyle = css`
  display: grid;

  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(2, 1fr);
  row-gap: 2rem;
  justify-content: space-between;
`;

export const camItemStyle = css`
  &:nth-child(2n + 1) {
    display: flex;
    justify-content: flex-start;
  }

  &:nth-child(2n) {
    display: flex;
    justify-content: flex-end;
  }
`;

export const camWrapperStyle = css`
  background-color: ${theme.colors.secondary};
  padding: 0.5rem;
  padding-bottom: 0rem;
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
