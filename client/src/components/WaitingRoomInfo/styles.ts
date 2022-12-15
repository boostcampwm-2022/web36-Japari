import { css, Theme } from "@emotion/react";

export const waitingRoomInfoStyle = css`
  display: flex;
  flex-direction: column;
  width: 72.5rem;
  height: 40rem;
`;

export const headerStyle = css`
  position: relative;
  left: 1rem;
  width: 90%;
  height: 3rem;

  > div {
    border-radius: 0.3rem 0.3rem 0 0;
  }
`;

export const mainWrapperStyle = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: inherit;
  flex-grow: 1;
  gap: 1rem;
  padding: 3rem;
  box-sizing: border-box;
  border-radius: 0.6rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.secondary};
`;

export const camListContainerStyle = css`
  display: grid;
  width: 100%;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 2rem;
  row-gap: 2rem;
`;

export const footerStyle = css`
  display: flex;
  justify-content: end;
  gap: 2rem;
`;

export const camBoxStyle = css`
  position: relative;
  z-index: 0;
`;

export const micStyle = css`
  width: 1.5rem;
  z-index: 1;
  position: absolute;
  left: 75%;
  top: 55%;
  border: 0.1em white solid;
  border-radius: 25rem;
  background-color: white;
`;
