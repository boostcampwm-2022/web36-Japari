import { css } from "@emotion/react";

export const roomRecordStyle = css`
  &:hover {
    background: blue;
    cursor: pointer;

    transition: all 0.3s;
  }

  display: inline-flex;
  width: 100%;
  padding: 0.75rem 0rem;

  background: #5992ff;
  border-radius: 0.3rem;

  > span {
    font-size: 1.1rem;
    font-weight: bold;
    color: white;

    padding-top: 0.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export const roomRecordPrivateIconStyle = css`
  width: 1.25rem;
  padding-left: 1.25rem;
  padding-right: 1rem;
`;

export const roomRecordTitleStyle = css`
  flex-grow: 1;
`;

export const roomRecordGameTypeStyle = css`
  width: 10rem;
  text-align: center;
`;

export const roomRecordPeopleStyle = css`
  width: 5rem;
  text-align: center;
`;

export const divisionLineStyle = css`
  background-color: white;
  width: 0.2rem;
  border-radius: 0.3rem;
`;
