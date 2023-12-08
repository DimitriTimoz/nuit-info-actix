import React from 'react';

import { Box, Heading, Progress, Stack, Text, VStack } from '@chakra-ui/react';
import thumbnail from 'assets/thumbnail.png';
import { useTranslation } from 'react-i18next';

import { CardMeasure } from '@/components/CardMeasure';
import { Page, PageContent } from '@/components/Page';
import { useGame, useGetMeasure } from '@/features/dashboard/service';
import { Loader } from '@/layout/Loader';

export default function PageDashboard() {
  useTranslation(['dashboard']);
  const { data: measure, isLoading } = useGetMeasure();
  const { data: game, isLoading: isGameLoading } = useGame();
  const { t } = useTranslation(['layout']);

  if (isGameLoading) return <Loader />;
  if (!game) return <Text>Aucune partie en cours :(</Text>;
  if (isLoading) return <Loader />;
  if (!measure) return <Text>Aucune mesure non trouvée :(</Text>;

  return (
    <Page containerSize="full">
      <PageContent>
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
            <CardMeasure measure={measure} src={thumbnail.src} />
          </Stack>
          <VStack flex={0.5} alignItems="center" justify="center">
            <Stack shadow="xl" p={12} bg="white" rounded="xl">
              <Heading mb="6" size="lg">
                Affinités
              </Heading>
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
      </PageContent>
    </Page>
  );
}
