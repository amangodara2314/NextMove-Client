import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";
import { ThemeProvider } from "./components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nextmove-ui-theme">
      <div className="h-full w-full">
        <Router />
      </div>
    </ThemeProvider>
  );
}
