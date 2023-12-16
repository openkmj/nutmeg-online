import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import ErrorPage from "./pages/Error";
import InvitedPage, { InvitedPageLoader } from "./pages/Invited";
import MainPage from "./pages/Main";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/:id",
    element: <InvitedPage />,
    loader: InvitedPageLoader,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <div id="page">
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
