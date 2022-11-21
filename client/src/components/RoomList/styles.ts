import { css } from "@emotion/react";

export const containerStyle = css`
  position: relative;
  display: inline-flex;
  flex-direction: column;

  > button {
    position: absolute;
    top: 0rem;
    right: 0rem;
  }
`;

export const roomListHeaderStyle = css`
  display: inline-block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;

  > label {
    line-height: 20px;
  }

  > select {
    margin-left: 1rem;
  }
`;

export const roomListStyle = css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  background-color: #f0efff;
  height: 35rem;
  padding: 1.5rem;
  border-radius: 10px;
  overflow-y: scroll;
`;
