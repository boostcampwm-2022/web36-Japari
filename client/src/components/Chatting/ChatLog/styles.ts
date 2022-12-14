import { css } from "@emotion/react";

export const ChatLogContainerStyle = css`
  width: 100%;
  height: 7.5rem;
  border-radius: 0.75rem;
  background-color: white;
  padding: 0.75rem;
  box-sizing: border-box;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
  overflow-y: overlay;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ChatLogStyle = css`
  display: flex;
  gap: 0.25rem;
  word-break: break-all;
`;
