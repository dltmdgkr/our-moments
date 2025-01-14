import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ImageProvider from "./context/ImageProvider";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ImageProvider>
          <App />
        </ImageProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
