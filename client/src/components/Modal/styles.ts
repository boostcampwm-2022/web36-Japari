import { css } from "@emotion/react";

export const dimmed = css`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const modalWrapper = css`
  display: inline-block;
  border-radius: 0.75rem;
  background-color: white;
  padding: 2.5rem 4rem;
`;

export const modalCard = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const modalTitle = css`
  font-size: 1.5rem;
  font-weight: bold;
`;
