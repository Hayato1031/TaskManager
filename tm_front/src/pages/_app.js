// Import necessary styles and components
import "@/styles/globals.css";
import { UIProvider, Box } from "@yamada-ui/react";
import Layout from "@/components/Layout";

// Define keyframes in a global CSS file or within a style tag
const keyframes = `
  @keyframes gra {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: 100% 100%;
    }
  }
`;

// Inject keyframes into the document head
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = keyframes;
  document.head.appendChild(style);
}

// Main App component
export default function App({ Component, pageProps }) {
  // CSS styles for the background box and component
  const CSS = {
    box: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: -1,
      backgroundColor: "#310975",
      backgroundImage: `
        radial-gradient(at 77% 20%, hsla(155,60%,77%,1) 0px, transparent 50%),
        radial-gradient(at 66% 80%, hsla(252,89%,78%,1) 0px, transparent 50%),
        radial-gradient(at 90% 52%, hsla(35,83%,74%,1) 0px, transparent 20%)`,
      backgroundSize: "250% 250%",
      animation: "gra 15.0s infinite alternate ease-in-out",
    },
    component: {
      color: "white",
    },
  };

  // Render the UI with the background and layout components
  return (
    <UIProvider>
      <Box style={CSS.box} />
      <Layout>
        <Component {...pageProps} style={CSS.component} />
      </Layout>
    </UIProvider>
  );
}