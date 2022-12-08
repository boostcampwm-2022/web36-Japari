import { css } from "@emotion/react";

export const TableRankContainerStyle = css`
  position: absolute;
  padding: 1.5rem 0 2rem 0.75rem;
  top: 0;
  left: 0;
  height: calc(100% - 3.5rem);
`;

export const TableStyle = css`
  overflow-y: overlay;
  padding: 0 1.5rem 0 1.5rem;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
`;

export const TableRankStyle = css`
  height: calc(100% / 10);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TableRankNumberStyle = css`
  text-align: center;
`;
