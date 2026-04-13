import React, { createContext, useContext, useMemo, useState } from "react";

type GrayscaleContextType = {
  grayscaleEnabled: boolean;
  toggleGrayscale: () => void;
  setGrayscaleEnabled: (value: boolean) => void;
};

const GrayscaleContext = createContext<GrayscaleContextType | undefined>(undefined);

export function GrayscaleProvider({ children }: { children: React.ReactNode }) {
  const [grayscaleEnabled, setGrayscaleEnabled] = useState(false);

  const value = useMemo(
    () => ({
      grayscaleEnabled,
      toggleGrayscale: () => setGrayscaleEnabled((prev) => !prev),
      setGrayscaleEnabled,
    }),
    [grayscaleEnabled]
  );

  return (
    <GrayscaleContext.Provider value={value}>
      {children}
    </GrayscaleContext.Provider>
  );
}

export function useGrayscale() {
  const context = useContext(GrayscaleContext);
  if (!context) {
    throw new Error("useGrayscale must be used inside GrayscaleProvider");
  }
  return context;
}