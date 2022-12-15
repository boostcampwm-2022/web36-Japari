import { css, Theme } from "@emotion/react";

export const inGameCamListStyle = css`
  display: grid;

  grid-template-rows: repeat(4, 1fr);
  row-gap: 2rem;
  justify-content: space-between;
`;

export const camWrapperStyle = (theme: Theme) => css`
  padding: 0.5rem;
  border-radius: 0.6rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  background-color: ${theme.colors.secondary};
`;
