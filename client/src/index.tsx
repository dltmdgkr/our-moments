import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ImageProvider from "./context/ImageProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ImageProvider>
      <App />
    </ImageProvider>
  </React.StrictMode>
);
