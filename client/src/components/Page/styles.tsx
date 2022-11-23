import { css, Theme } from "@emotion/react";

export const PageContainer = (theme: Theme) => css`
  background-color: ${theme.colors.primary};
  min-height: 100vh;
  display: inline-block;
  min-width: 100%;
`;
