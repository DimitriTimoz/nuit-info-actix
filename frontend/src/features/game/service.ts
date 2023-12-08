import { useMutation } from '@tanstack/react-query';
import Axios from 'axios';
import { z } from 'zod';

export const useCreateGame = ({ ...config }) =>
  useMutation({
    mutationKey: ['createGame'],
    mutationFn: async (pseudo: string) => {
      const response = await Axios.post('/create_game', { pseudo });

      const token = z.string().parse(response.data);

      await localStorage.setItem('token', token);
      await localStorage.setItem('pseudo', pseudo);
      await localStorage.setItem('49.3', 'true');

      return token;
    },
    ...config,
  });
