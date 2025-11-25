import React from "react";
import { useMediaQuery } from "react-responsive";
import WebApp from "./WebApp";
import MobileApp from "./MobileApp";

export default function App() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // mobile threshold

  return (
    <>
      {isMobile ? <MobileApp /> : <WebApp />}
    </>
  );
}
