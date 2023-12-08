import React from 'react';

import { Box, Heading, Progress, Stack, Text, VStack } from '@chakra-ui/react';
import thumbnail from 'assets/thumbnail.png';
import { useTranslation } from 'react-i18next';

import { CardMeasure } from '@/components/CardMeasure';
import { Page, PageContent } from '@/components/Page';
import { useGetMeasure } from '@/features/dashboard/service';
import { Loader } from '@/layout/Loader';

export default function PageDashboard() {
  useTranslation(['dashboard']);
  const { data: measure, isLoading } = useGetMeasure();
  const { t } = useTranslation(['layout']);

  if (isLoading) return <Loader />;
  if (!measure) return <Text>Mesure non trouvé :(</Text>;

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
                <Progress value={50} size="md" width="full" rounded="xl" />
              </VStack>
              <VStack width="full">
                <Heading size="md">{t('layout:dashboard.social')}</Heading>
                <Progress value={50} size="md" width="full" rounded="xl" />
              </VStack>

              <VStack width="full">
                <Heading size="md">{t('layout:dashboard.economy')}</Heading>
                <Progress value={50} size="md" width="full" rounded="xl" />
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
                  <Text>50%</Text>
                </Box>
                <Box>
                  <Heading size="md">
                    {t('layout:dashboard.united_nation')}
                  </Heading>
                  <Text>50%</Text>
                </Box>
                <Box>
                  <Heading size="md">{t('layout:dashboard.cartel')}</Heading>
                  <Text>50%</Text>
                </Box>
              </Stack>
            </Stack>
          </VStack>
        </Stack>
      </PageContent>
    </Page>
  );
}
