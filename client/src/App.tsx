/** @format */

import { ThemeCtx } from "./context/ThemeContext";
import { useContext, useEffect } from "react";
import useApi from "./api";
import { useState } from "react";
import Login from "./component/login.component";
import Register from "./component/register.component";

// MAIN APP
function App() {
  const theme = useContext(ThemeCtx);
  const [view, setView] = useState<"login" | "register">("login");

  useEffect(() => {
    const body = document?.body;
    if (theme && body) {
      body?.setAttribute("data-theme", theme?.currentValue);
    }
  }, [theme]);



  return (
          <div className="flex flex-col items-center justify-center p-[20px] h-screen">
          {view === "login" ? (
                               <Login setView={setView} />
                               ) : (
                               <Register setView={setView} />
                               )}
                               <div></div>
                               </div>
                               );
}

export default App;
