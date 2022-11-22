import { css, Theme } from "@emotion/react";

export const containerStyle = css`
  position: relative;
  display: inline-flex;
  flex-direction: column;
`;

export const headerStyle = css`
  display: inline-flex;
  justify-content: space-between;
  align-items: flex-end;

  margin: 0 1rem;
  margin-bottom: 1rem;
`;

export const filterStyle = css`
  display: inline-flex;
  gap: 1rem;
  align-items: center;
`;

export const checkBoxStyle = css`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

export const roomListStyle = (theme: Theme) => css`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  height: 35rem;
  padding: 1.5rem;
  border-radius: 10px;
  overflow-y: scroll;

  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.secondary};
`;
