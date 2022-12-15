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

export const micStyle = css`
  width: 1.5rem;
  z-index: 1;
  position: absolute;
  left: 80%;
  top: 55%;
  border: 0.1em white solid;
  border-radius: 25rem;
  background-color: white;
`;

export const camBoxStyle = css`
  position: relative;
  z-index: 0;
`;
