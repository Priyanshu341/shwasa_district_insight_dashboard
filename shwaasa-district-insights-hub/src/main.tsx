// // // import { createRoot } from 'react-dom/client'
// // // import App from './App.tsx'
// // // import './index.css'

// // // createRoot(document.getElementById("root")!).render(<App />);
// // import React from "react";
// // import ReactDOM from "react-dom/client";
// // import App from "./App";
// // import { BrowserRouter } from "react-router-dom";
// // import "./index.css"; // assuming TailwindCSS is here

// // ReactDOM.createRoot(document.getElementById("root")!).render(
// //   <React.StrictMode>
// //     <BrowserRouter>
// //       <App />
// //     </BrowserRouter>
// //   </React.StrictMode>
// // );
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css"; // Tailwind CSS entry

// const rootElement = document.getElementById("root") as HTMLElement;

// ReactDOM.createRoot(rootElement).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root") as HTMLElement;
const queryClient = new QueryClient();

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
