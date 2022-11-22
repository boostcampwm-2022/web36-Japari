import { css } from "@emotion/react";

export const TableContainerStyle = css`
  position: relative;
  background-color: #f0efff;
  border-radius: 0.75rem;
  flex-grow: 1;
  padding: 1.5rem 2rem 2rem 2rem;
  box-sizing: border-box;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
`;

export const TableRankContainerStyle = css`
  position: absolute;
  padding: 1.5rem 0 2rem 0.75rem;
  top: 0;
  left: 0;
  height: calc(100% - 3.5rem);
`;

export const TableStyle = css`
  overflow: scroll;
  height: 100%;
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
