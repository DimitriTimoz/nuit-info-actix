import React from 'react';

import {
  Box,
  Grid,
  Heading,
  Progress,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import thumbnail from 'assets/thumbnail.png';
import { useTranslation } from 'react-i18next';

import { CardMeasure } from '@/components/CardMeasure';
import { Page, PageContent } from '@/components/Page';
import { useGetMeasure } from '@/features/dashboard/service';
import { Loader } from '@/layout/Loader';

export default function PageDashboard() {
  useTranslation(['dashboard']);
  const { data: measure, isLoading } = useGetMeasure();

  if (isLoading) return <Loader />;
  if (!measure) return <Text>Mesure non trouvé :(</Text>;

  return (
    <Page containerSize="full">
      <PageContent>
        <Stack p="16" direction={{ base: 'column', md: 'row' }}>
          <VStack justifyContent="center" alignItems="center" flex={1}>
            <VStack width="full" mb="4">
              <Heading size="md">Environnement</Heading>
              <Progress value={50} size="md" width="full" />
            </VStack>

            <VStack width="full" mb="4">
              <Heading size="md">Social</Heading>
              <Progress value={50} size="md" width="full" />
            </VStack>

            <VStack width="full" mb="4">
              <Heading size="md">Economie</Heading>
              <Progress value={50} size="md" width="full" />
            </VStack>
          </VStack>
          <Stack flex={1} alignItems="center" justify="center">
            <CardMeasure measure={measure} src={thumbnail.src} />
          </Stack>
          <VStack flex={1} justify="center" alignItems="center">
            <Box>
              <Heading size="md">Affinité faction 1</Heading>
              <Text>50%</Text>
            </Box>
            <Box>
              <Heading size="md">Affinité faction 2</Heading>
              <Text>50%</Text>
            </Box>
            <Box>
              <Heading size="md">Affinité faction 3</Heading>
              <Text>50%</Text>
            </Box>
          </VStack>
        </Stack>
      </PageContent>
    </Page>
  );
}
