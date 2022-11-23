import React from "react";

import { Header } from "../Header";
import "./page.css";

interface PageProps {
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => {
  return (
    <div>
      <Header headerType="랜딩" />
      {children}
    </div>
  );
};
