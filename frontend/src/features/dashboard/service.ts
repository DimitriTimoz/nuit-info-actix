import { useQuery } from '@tanstack/react-query';
import Axios from 'axios';

import { zMeasure } from '@/features/dashboard/schema';

export const useHelloWorld = () =>
  useQuery({
    queryKey: ['hey'],
    queryFn: async () => {
      return await Axios.get('/hey');
    },
  });
export const useGetMeasure = () =>
  useQuery({
    queryKey: ['measure'],
    queryFn: async () => {
      const response = await Axios.get('/measure');
      return zMeasure().parse(response.data);
    },
  });
