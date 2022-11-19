import React from "react";

import { Header } from "./Header";
import "./page.css";

type User = {
  name: string;
};

interface PageProps {
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ children }) => {
  const [user, setUser] = React.useState<User>();

  return (
    <div>
      <Header
        user={user}
        onLogin={() => setUser({ name: "Jane Doe" })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: "Jane Doe" })}
      />
      {children}
    </div>
  );
};
