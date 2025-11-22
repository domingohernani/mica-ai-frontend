import { useState } from "react";
import axios from "axios";

const useError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || err.message);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError(String(err));
    }
  };

  return { error, setError: handleError };
};

export default useError;
