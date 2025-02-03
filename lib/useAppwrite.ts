import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

function useAppwrite<T>(fn: () => Promise<T>): {
  data: T | null;
  loading: boolean;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fn();
      setData(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error!",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, loading, refetch };
}

export default useAppwrite;
