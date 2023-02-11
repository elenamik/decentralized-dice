import React from "react";

const Web3LoadingContext = React.createContext({
  isWeb3Loading: false,
  // eslint-disable-next-line no-unused-vars
  setIsWeb3Loading: (isWeb3Loading: boolean) => {},
});

export const Web3LoadingProvider: React.FC<React.ProviderProps<any>> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  return (
    <Web3LoadingContext.Provider
      value={{ isWeb3Loading: isLoading, setIsWeb3Loading: setIsLoading }}
    >
      {children}
    </Web3LoadingContext.Provider>
  );
};

export const useWeb3LoadingContext = () => React.useContext(Web3LoadingContext);
