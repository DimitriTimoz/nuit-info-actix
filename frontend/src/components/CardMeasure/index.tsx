import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';

import { Measure } from '@/features/dashboard/schema';

export const CardMeasure = ({
  src,
  measure,
}: {
  src: string;
  measure: Measure;
}) => {
  return (
    <Card shadow="2xl">
      <CardBody>
        <Stack>
          <Text textAlign="center" fontWeight="bold">
            {measure?.title}
          </Text>
          <Text textAlign="center">{measure?.description}</Text>
          <Image
            aspectRatio={1}
            alignSelf="center"
            src={src}
            alt="thumbnail"
            maxW="80%"
            rounded="md"
          />
        </Stack>
      </CardBody>
      <CardFooter display="flex" justify="center" gap="6">
        <ButtonGroup flex={1} justifyContent="space-evenly">
          <Button colorScheme="red" size="sm">
            Refuser
          </Button>
          <Button colorScheme="green" size="sm">
            Accepter
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
