import { css } from "@emotion/react";

export const modalWrapper = css`
  border-radius: 0.75rem;
  // border: 0.01rem solid black;
  background-color: white;
  width: 30rem;
  padding: 2.5rem 1rem;
`;

export const modalCard = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

export const modalTitle = css`
  font-weight: bold;
`;

export const modalContents = css`
  display: flex;
  justify-content: center;
  gap: 1rem;
  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // height: 7.5rem;
    /* padding-inline-start: 0px; */
    /* margin: 0px; */

    li {
      height: 4rem;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      input[type="text"],
      select {
        width: 16rem;
      }
    }
  }
`;
