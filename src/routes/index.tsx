import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const router = createBrowserRouter([
  { path: "/", element: <div>Home Page</div> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

export default router;
