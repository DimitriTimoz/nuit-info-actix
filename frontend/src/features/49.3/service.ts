import { useQuery } from '@tanstack/react-query';

export const useBorne = () => {
  useQuery({
    queryKey: ['borne'],
    queryFn: async () => {
      // send 49.3 to backend
    },
  });
};
