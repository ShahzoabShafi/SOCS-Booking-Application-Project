import React from "react";
// Miguel Angel Vargas Valencia
// This component renders a 404 Not Found error page.
// It is displayed when a user tries to navigate to a route that doesn't exist.
// Just here as a fale safe
// Ideally the user should never reach this page but it is here in case of an error
export default function Error404() {
  return (
    <div className="error-404-container">
       {/* In-component styles for the 404 page */}
      <style>
        {`
          .error-404-container {
            text-align: center;
            padding: 50px;
            font-family: Arial, sans-serif;
          }
          .error-title {
            font-size: 72px;
            color: #ff6f61;
            margin-bottom: 20px;
          }

          .error-message-errorpage {
            font-size: 24px;
            color: #333;
          }

          /* Media Query for screens up to 800px */
          @media (max-width: 800px) {
            .error-title {
              font-size: 60px;
            }

            .error-message-errorpage {
              font-size: 20px;
            }

            .error-404-container {
              padding: 30px;
            }
          }

          /* Media Query for screens up to 600px */
          @media (max-width: 600px) {
            .error-title {
              font-size: 48px;
            }

            .error-message-errorpage {
              font-size: 18px;
            }

            .error-404-container {
              padding: 20px;
            }
          }
        `}
      </style>
         {/* The main 404 error title */}
      <h1 className="error-title">404</h1>
         {/* An user-friendly error message */}
      <p className="error-message-errorpage">Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
}
