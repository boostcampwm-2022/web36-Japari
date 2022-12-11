import { css, Theme } from "@emotion/react";

export const ListContainerStyle = css`
  display: flex;
  flex-direction: column;
  width: 20rem;
  height: 40rem;
`;

export const TableContainerStyle = (theme: Theme) => css`
  position: relative;

  border-radius: 0.75rem;
  flex-grow: 1;
  padding: 1.5rem 0.5rem 2rem 0.5rem;
  box-sizing: border-box;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);

  background-color: ${theme.colors.secondary};

  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
