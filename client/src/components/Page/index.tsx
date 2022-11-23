/** @jsxImportSource @emotion/react */
import React from "react";
import { Header } from "../Header";
import * as style from "./styles";

interface PageProps {
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <div css={style.PageContainer}>
      <Header headerType="로비" />
      {children}
    </div>
  );
};
