import { css, Theme } from "@emotion/react";

export const ProfileContainerStyle = (theme: Theme) => css`
  background-color: ${theme.colors.secondary};
  width: 20rem;
  height: 12.5rem;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
`;
