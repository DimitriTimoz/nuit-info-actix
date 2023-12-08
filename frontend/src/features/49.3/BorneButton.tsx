import React from 'react';

import { Button } from '@chakra-ui/react';

import { useBorne } from './service';

export default function BorneButton() {
  // TODO: useBorne() hook
  useBorne();

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
    >
      49.3
    </Button>
  );
}
