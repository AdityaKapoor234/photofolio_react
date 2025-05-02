// React state management
import { useState } from "react";

// Import routing management libraries
import { Route, BrowserRouter, Routes } from "react-router-dom";

// Import application components
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Album from "./components/album/Album";
import ErrorPage from "./components/error-page/ErrorPage";

// Theme container component for global styling
import { ThemeContainer } from "./style/theme";

// Toast notification container
import { ToastContainer } from 'react-toastify';


export default function App() {
  // State for dark/light theme mode
  const [darkMode, setDarkMode] = useState(false);

  return (
    /**
     * ThemeContainer wraps the entire app and provides:
     * - Dynamic background color based on theme (dark/light)
     * - Dynamic text color based on theme (dark/light)
     */
    <ThemeContainer color={darkMode ? "#3b3b3b" : "#ffffff"} textColor={darkMode ? "#ffffff" : "#000000"}>
      {/* 
       * BrowserRouter enables client-side routing
       * Wraps all route components
       */}
      <BrowserRouter>
        {/*
         * Routes container defines all application routes
         * Uses nested routing structure
         */}
        <Routes>
          {/*
           * Main layout route that includes the Navbar
           * Passes darkMode state and setter to Navbar
           */}
          <Route
            path="/"
            element={<Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
            errorElement={<ErrorPage />}
          >
            {/* Index route - renders Home component at root path */}
            <Route index element={<Home />} />
            {/*
             * Dynamic route for individual albums
             * :albumID is a URL parameter
             */}
            <Route path="album/:albumID" element={<Album />} />
            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/*
       * ToastContainer provides a portal for displaying notifications
       * Position and styling can be configured via props
       */}
      <ToastContainer />
    </ThemeContainer>
  );
}
