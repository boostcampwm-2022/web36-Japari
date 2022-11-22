import { css, Theme } from "@emotion/react";

export const waitingRoomInfoStyle = css``;

export const headerStyle = css`
  position: relative;
  left: 1rem;

  > div {
    border-radius: 5px 5px 0 0;
  }
`;

export const mainWrapperStyle = (theme: Theme) => css`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2rem;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.secondary};
`;

export const camListContainerStyle = css`
  display: grid;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 3rem;
  row-gap: 3rem;
`;

export const footerStyle = css`
  display: inline-block;
`;
