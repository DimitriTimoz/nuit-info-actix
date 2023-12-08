import { useQuery } from '@tanstack/react-query';

export const useSessionToken = (sessionToken: string) =>
  useQuery({
    queryKey: ['sessionToken'],
    queryFn: () => {
      localStorage.setItem('sessionToken', sessionToken);
    },
  });
