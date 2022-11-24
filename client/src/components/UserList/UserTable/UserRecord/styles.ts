import { css } from "@emotion/react";

export const UserRecordContainerStyle = css`
  height: 10%;
  padding: 0 0.25rem 0 0.25rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.1rem solid black;
  box-sizing: border-box;
`;

export const ImageAndConnectionStyle = css`
  position: relative;
`;

export const ImageDivStyle = css`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 0.1rem solid white;
  overflow: hidden;
  box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
`;

export const ImageStyle = css`
  width: 100%;
  height: 100%;
`;

export const UserNicknameStyle = css`
  width: 40%;
  text-align: center;
  font-size: 0.85rem;
  font-weight: bold;
`;

export const UserScoreStyle = css`
  width: 30%;
  text-align: end;
  font-size: 0.75rem;
`;

export const ConnectionCircleStyle = css`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 0.1rem solid white;
`;

export const OnCircleStyle = css`
  background-color: #37f081;
`;

export const OffCircleStyle = css`
  background-color: #b3b3b3;
`;
