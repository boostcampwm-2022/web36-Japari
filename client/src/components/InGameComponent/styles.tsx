import { css, Theme } from "@emotion/react";

export const PlayingContentContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 0 1rem 2rem 1rem;
`;

export const GameAndChatContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

export const GameContainerStyle = (theme: Theme) => css`
  background-color: ${theme.colors.secondary};
  height: 40rem;
  width: 72.5rem;
  border-radius: 0.75rem;
  text-align: center;
  padding: 2rem;
  box-sizing: border-box;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
`;
