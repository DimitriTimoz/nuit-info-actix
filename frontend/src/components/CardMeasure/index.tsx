import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Measure } from '@/features/dashboard/schema';
import {
  useAcceptMeasure,
  useRejectMeasure,
} from '@/features/dashboard/service';

export const CardMeasure = ({
  measure,
  refetchGame,
  refetchMeasure,
}: {
  measure: Measure;
  refetchGame: () => void;
  refetchMeasure: () => void;
}) => {
  const { t } = useTranslation(['layout']);

  const { mutate: acceptMeasure, isLoading: isAccepting } = useAcceptMeasure({
    onSuccess: () => {
      refetchGame();
      refetchMeasure();
    },
  });
  const { mutate: rejectMeasure, isLoading: isRejecting } = useRejectMeasure({
    onSuccess: () => {
      refetchGame();
      refetchMeasure();
    },
  });
  return (
    <Card shadow="2xl">
      <CardBody minH="sm">
        <Stack>
          <Text textAlign="center" fontWeight="bold">
            {measure?.title}
          </Text>
          <Text textAlign="center">{measure?.description}</Text>
        </Stack>
      </CardBody>
      <CardFooter display="flex" justify="center" gap="6">
        <ButtonGroup flex={1} justifyContent="space-evenly">
          <Button
            onClick={() => rejectMeasure()}
            isLoading={isAccepting || isRejecting}
            colorScheme="orange"
            size="sm"
          >
            {t('layout:dashboard.reject')}
          </Button>
          <Button
            onClick={() => acceptMeasure()}
            isLoading={isAccepting || isRejecting}
            colorScheme="teal"
            size="sm"
          >
            {t('layout:dashboard.accept')}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
