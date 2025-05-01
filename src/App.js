import { useState } from "react";

// Import routing management libraries
import { Route, BrowserRouter, Routes } from "react-router-dom";

// Import application components
import Navbar from "./components/navbar/Navbar";
import Home from "./components/home/Home";
import Album from "./components/album/Album";

import { ThemeContainer } from "./style/theme";

// Toast notification container
import { ToastContainer } from 'react-toastify';

// const routes = createRoutesFromElements(
//   <>
//     <Route path="/" element={<Navbar />}>
//       <Route index element={<Home />} />
//       <Route path="album/:albumID" element={<Album />} />
//     </Route>
//   </>
// );

// const router = createBrowserRouter(routes);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeContainer color={darkMode ? "#3b3b3b" : "#ffffff"} textColor={darkMode ? "#ffffff" : "#000000"}>
      {/* <RouterProvider router={router} /> */}


      {/* Initialize the Router */}
      <BrowserRouter>
        {/* Define application routes */}
        <Routes>
          <Route path="/" element={<Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}>
            <Route index element={<Home />} />
            <Route path="album/:albumID" element={<Album />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Container for toast notifications */}
      <ToastContainer />
    </ThemeContainer>
  );
}
