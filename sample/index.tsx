import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { GlobalStyle, theme, NavBar } from "../src";
import unologo from "../public/assets/unosquare_logo.svg";

const Application = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <NavBar img={unologo} />
  </ThemeProvider>
);

const container = document.getElementById("root");
const root = createRoot(container as any);

root.render(<Application />);
