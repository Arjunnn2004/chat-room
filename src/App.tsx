import { Outlet } from "react-router";
import "./App.css";

function App() {
  return (
    <>
      <div className="flex justify-center items-center bg-slate-900 min-h-screen">
        <Outlet />
      </div>
    </>
  );
}

export default App;
