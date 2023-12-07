import { useQuery } from '@tanstack/react-query';
import Axios from 'axios';

export const useHelloWorld = () =>
  useQuery({
    queryKey: ['hey'],
    queryFn: async () => {
      return await Axios.get('/hey');
    },
  });
