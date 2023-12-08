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
import { useTranslation } from 'react-i18next';

import { Measure } from '@/features/dashboard/schema';

export const CardMeasure = ({
  src,
  measure,
}: {
  src: string;
  measure: Measure;
}) => {
  const { t } = useTranslation(['layout']);
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
          <Button colorScheme="orange" size="sm">
            {t('layout:dashboard.reject')}
          </Button>
          <Button colorScheme="teal" size="sm">
            {t('layout:dashboard.accept')}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
