import { css, Theme } from "@emotion/react";

export const ProfileContainerStyle = (theme: Theme) => css`
  background-color: ${theme.colors.secondary};
  width: 22.5rem;
  height: 12.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
`;
