import { css } from "@emotion/react";

export const roomRecordStyle = css`
  &:hover {
    background: blue;
    cursor: pointer;
  }

  display: inline-flex;

  padding: 0.75rem 0rem;

  background: #5992ff;
  border-radius: 5px;

  > *:first-child {
    width: 1.25rem;
    padding-left: 1.25rem;
    padding-right: 1rem;
  }

  > span {
    font-size: 18px;
    font-weight: bold;
    color: white;

    padding-top: 0.25rem;
    padding-left: 1rem;
    padding-right: 1rem;

    &:nth-child(3) {
      width: 30rem;
    }

    &:nth-child(5) {
      width: 10rem;
      text-align: center;
    }

    &:nth-child(7) {
      width: 3rem;
      text-align: center;
    }
  }
`;

export const divisionLineStyle = css`
  background-color: white;
  width: 0.2rem;
  border-radius: 5px;
`;
