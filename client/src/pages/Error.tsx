import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import "./Error.css";

const ErrorPage = () => {
  const error = useRouteError();
  let eTitle = "400 Internal Error";
  let eMessage = "";
  if (isRouteErrorResponse(error)) {
    eTitle = `${error.status} - ${error.statusText}`;
    eMessage = error?.data;
  } else if (error instanceof Error) {
    eTitle = `400 - ${error.name}`;
    eMessage = error.message;
  } else if (typeof error === "string") {
    eMessage = error;
  } else {
    console.error(error);
    eMessage = "Unknown Error";
  }

  return (
    <div className="error">
      <h1>Oops,</h1>
      <h1>Something Wrong...?</h1>
      <p>
        <i>{eTitle}</i>
      </p>
      <p>
        <i>{eMessage}</i>
      </p>
      <button
        onClick={() => {
          location.href = "/";
        }}
      >
        Back To Main
      </button>
    </div>
  );
};

export default ErrorPage;
