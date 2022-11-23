/** @jsxImportSource @emotion/react */
import React from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import * as style from "./styles";

interface PageProps {
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => {
  const location = useLocation();

  let headerType: "랜딩" | "로비" | "게임 대기실" | "게임 진행" = "랜딩";
  switch (location.pathname.split("/")[1]) {
    case "":
      headerType = "랜딩";
      break;
    case "lobby":
      headerType = "로비";
      break;
    case "waiting":
      headerType = "게임 대기실";
      break;
    case "playing":
      headerType = "게임 진행";
      break;
  }

  return (
    <div css={style.PageContainer}>
      <Header headerType={headerType} />
      {children}
    </div>
  );
};
