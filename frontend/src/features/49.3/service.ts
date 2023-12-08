import { useMutation } from '@tanstack/react-query';
import Axios from 'axios';

export const useBorne = ({ ...config }) =>
  useMutation({
    mutationKey: ['borne'],
    mutationFn: async () => {
      if (localStorage.getItem('49.3') === 'false') {
        return 400;
      }
      const response = await Axios.post('/fifty-nine-three');

      if (response.status === 200) {
        localStorage.setItem('49.3', 'false');
      }

      return response.data;
    },
    ...config,
  });
