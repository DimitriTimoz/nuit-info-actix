import { useMutation, useQuery } from '@tanstack/react-query';
import Axios from 'axios';

import { zGame, zMeasure } from '@/features/dashboard/schema';

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

export const useGame = () =>
  useQuery({
    queryKey: ['game'],
    queryFn: async () => {
      const response = await Axios.get('/game');

      return zGame().parse(response.data);
    },
  });

export const useRejectMeasure = ({ ...config }) =>
  useMutation({
    mutationKey: ['rejectMeasure'],
    mutationFn: async () => {
      const response = await Axios.post('/reject');
      return response.data;
    },
    ...config,
  });
export const useAcceptMeasure = ({ ...config }) =>
  useMutation({
    mutationKey: ['acceptMeasure'],
    mutationFn: async () => {
      const response = await Axios.post('/accept');
      return response.data;
    },
    ...config,
  });
