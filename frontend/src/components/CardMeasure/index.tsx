import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Image,
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
    <Card
      width={{ base: '90%', sm: '80%', md: '65%' }}
      height="fit-content"
      shadow="2xl"
    >
      <CardBody>
        <Box display="flex" flexDirection="column" justifyItems="center">
          <Text textAlign="center" fontWeight="bold">
            {measure?.title}
          </Text>
          <Text textAlign="center">{measure?.description}</Text>
          <Image
            aspectRatio={3 / 1}
            src={src}
            alt="thumbnail"
            mx="12"
            my="4"
            rounded="md"
          />
        </Box>
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
