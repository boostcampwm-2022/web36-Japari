import { css, Theme } from "@emotion/react";

export const waitingRoomInfoStyle = css`
  display: flex;
  flex-direction: column;
  width: 60rem;
  height: 40rem;
`;

export const headerStyle = css`
  position: relative;
  left: 1rem;
  width: 90%;
  height: 3rem;

  > div {
    border-radius: 5px 5px 0 0;
  }
`;

export const mainWrapperStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: inherit;
  flex-grow: 1;
  gap: 2rem;
  padding: 3rem;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.secondary};
`;

export const camListContainerStyle = css`
  display: grid;
  width: 100%;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 3rem;
  row-gap: 3rem;
`;

export const footerStyle = css`
  display: flex;
  justify-content: end;
  gap: 2rem;
`;
