import React from 'react';

import { Button } from '@chakra-ui/react';

import { useToastError, useToastSuccess } from '@/components/Toast';

import { useBorne } from './service';

export default function BorneButton() {
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const { mutate, isLoading } = useBorne({
    onSuccess: () => {
      toastSuccess({
        title: "Bornne accepté ! L'alinéa 2 de l'article 49.3 a été utilisé.",
      });
    },
    onError: () => {
      toastError({
        title:
          "Borne refusé ! L'alinéa 2 de l'article 49.3 a déjà été utilisé.",
      });
    },
  });

  return (
    <Button
      position="absolute"
      top="10"
      right="10"
      bg="orange"
      color="black"
      w="16"
      h="16"
      rounded="full"
      shadow="xl"
      isLoading={isLoading}
      onClick={() => mutate()}
    >
      49.3
    </Button>
  );
}
