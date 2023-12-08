import React, { useEffect } from 'react';

import {
  Box,
  Button,
  Card,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { LuHeartHandshake } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { CardMeasure } from '@/components/CardMeasure';
import { Icon } from '@/components/Icons';
import { Page, PageContent } from '@/components/Page';
import { useToastInfo } from '@/components/Toast';
import { useGame, useGetMeasure } from '@/features/dashboard/service';
import { Loader } from '@/layout/Loader';

export default function PageDashboard() {
  const navigate = useNavigate();
  const { data: measure, isLoading, refetch } = useGetMeasure();
  const {
    data: game,
    isLoading: isGameLoading,
    refetch: refetchGame,
  } = useGame();

  const toastInfo = useToastInfo();
  const { onOpen } = useDisclosure();
  const { t } = useTranslation(['layout']);

  useEffect(() => {
    if (!game && !localStorage.getItem('token')) return navigate('/');
    if (game?.game_over) {
      onOpen();
    }
    if (game?.notification && !game.game_over) {
      toastInfo({
        title: 'Notification',
        description: game?.notification,
      });
    }
  }, [game]);

  if (isGameLoading) return <Loader />;
  if (isLoading) return <Loader />;
  if (!measure) return <Text>Aucune mesure non trouvée :(</Text>;
  if (!game) {
    navigate('/');
    return <Text>Aucune partie trouvé</Text>;
  }

  const parseMeasure = (measure: number) => {
    if (measure < 0) return 0;
    if (measure > 100) return 100;
    return measure;
  };
  const handleGameOver = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('pseudo');
    localStorage.removeItem('49.3');

    navigate('/');
  };
  return (
    <Page containerSize="full">
      <PageContent>
        <Stack>
          <Text fontWeight="bold">{localStorage.getItem('pseudo')}</Text>
        </Stack>
        <Stack align="center">
          <Card px="6" py="4">
            <Stack direction="row" align="center">
              <Icon fontSize="2xl" icon={FaRegCalendarAlt} />
              <Text fontSize="2xl" fontWeight="bold">
                {`${
                  (!!game.current_month ? game.current_month : 1).toString()
                    .length < 2
                    ? `0${game.current_month}`
                    : game.current_month
                }/${game.current_year}`}
              </Text>
            </Stack>
          </Card>
        </Stack>
        <Stack p="16" direction={{ base: 'column', lg: 'row' }}>
          <VStack justifyContent="center" alignItems="center" flex={0.5}>
            <Stack spacing={6} shadow="xl" bg="white" rounded="xl" p={12}>
              <VStack width="full">
                <Heading size="md">
                  {t('layout:dashboard.environement')}
                </Heading>
                <Progress
                  value={game.environmental}
                  size="md"
                  width="full"
                  rounded="xl"
                />
              </VStack>
              <VStack width="full">
                <Heading size="md">{t('layout:dashboard.social')}</Heading>
                <Progress
                  value={game.social}
                  size="md"
                  width="full"
                  rounded="xl"
                />
              </VStack>

              <VStack width="full">
                <Heading size="md">{t('layout:dashboard.economy')}</Heading>
                <Progress
                  value={game.economic}
                  size="md"
                  width="full"
                  rounded="xl"
                />
              </VStack>
            </Stack>
          </VStack>
          <Stack flex={1} p={12} alignItems="center" justify="center">
            <CardMeasure
              measure={measure}
              refetchGame={refetchGame}
              refetchMeasure={refetch}
            />
          </Stack>
          <VStack flex={0.5} alignItems="center" justify="center">
            <Stack shadow="xl" p={12} bg="white" rounded="xl">
              <Stack align="center">
                <Icon fontSize="2xl" icon={LuHeartHandshake} />
                <Heading mb="6" size="lg">
                  Affinités
                </Heading>
              </Stack>
              <Stack>
                <Box>
                  <Heading size="md">
                    {t('layout:dashboard.scientists')}
                  </Heading>
                  <Text>{game.scientist}%</Text>
                </Box>
                <Box>
                  <Heading size="md">
                    {t('layout:dashboard.united_nation')}
                  </Heading>
                  <Text>{game.united_nations}%</Text>
                </Box>
                <Box>
                  <Heading size="md">{t('layout:dashboard.cartel')}</Heading>
                  <Text>{game.cartel}%</Text>
                </Box>
              </Stack>
            </Stack>
          </VStack>
        </Stack>
        <Modal isOpen={game.game_over} onClose={() => null}>
          <ModalOverlay />
          <ModalContent>
            <Stack spacing={5}>
              <ModalHeader alignSelf="center">Game Over</ModalHeader>
              <ModalBody>
                <Text>Cartel: {parseMeasure(game.cartel)}%</Text>
                <Text>Scientifique: {parseMeasure(game.scientist)}%</Text>
                <Text>ONU: {parseMeasure(game.united_nations)}%</Text>
                <Text>Environnement: {parseMeasure(game.environmental)}%</Text>
                <Text>Social: {parseMeasure(game.social)}%</Text>
                <Text>Economique: {parseMeasure(game.economic)}%</Text>
              </ModalBody>
              <ModalFooter alignItems="center">
                <Button flex={1} colorScheme="teal" onClick={handleGameOver}>
                  Recommencer une partie
                </Button>
              </ModalFooter>
            </Stack>
          </ModalContent>
        </Modal>
      </PageContent>
    </Page>
  );
}
