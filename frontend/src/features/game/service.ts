import { useMutation } from '@tanstack/react-query';
import Axios from 'axios';
import { z } from 'zod';

export const useCreateGame = ({ ...config }) =>
  useMutation({
    mutationKey: ['createGame'],
    mutationFn: async (pseudo: string) => {
      const response = await Axios.post('/games', { pseudo });

      const parsedResponse = z
        .object({ token: z.string() })
        .parse(response.data);
      localStorage.setItem('token', parsedResponse.token);
      localStorage.setItem('pseudo', pseudo);
      localStorage.setItem('49.3', 'true');

      return parsedResponse;
    },
    ...config,
  });
