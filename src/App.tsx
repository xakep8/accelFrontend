import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./App.css";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-50">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
