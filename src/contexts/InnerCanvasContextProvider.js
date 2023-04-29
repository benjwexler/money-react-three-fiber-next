import { useTexture } from "@react-three/drei";
import { createContext, useContext, useMemo } from "react";

const InnerCanvasContext = createContext();

export const useInnerCanvasContext = () => useContext(InnerCanvasContext);

const InnerCanvasContextProvider = ({ children }) => {
  const dollarTexture = useTexture("usdollar100front.jpeg");
  const value = useMemo(
    () => ({
      dollarTexture,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <InnerCanvasContext.Provider value={value}>
      {children}
    </InnerCanvasContext.Provider>
  );
};

export default InnerCanvasContextProvider;
