import "@emotion/react";

declare module "@emotion/react" {
  export interface ColorTheme {
    primary: string;
    secondary: string;
  }

  export interface Theme {
    colors: ColorTheme;
  }
}
