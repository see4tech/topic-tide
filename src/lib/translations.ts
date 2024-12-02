import { useQuery } from "@tanstack/react-query";

export const useTranslations = () => {
  return useQuery({
    queryKey: ["translations"],
    queryFn: () => ({}),
    initialData: {},
  });
};