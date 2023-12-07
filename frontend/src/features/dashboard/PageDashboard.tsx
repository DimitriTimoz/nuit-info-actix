import React from 'react';

import { Box, Grid, Heading, Progress, Text, VStack } from '@chakra-ui/react';
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
      <PageContent
        mx={{
          base: '4',
          sm: '6',
          md: '8',
          lg: '10',
        }}
      >
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 2fr 1fr' }}
          templateRows={{ base: '1fr 2fr 1fr', md: '1fr' }}
          gap="4"
          placeItems="center"
          justifyContent="center"
        >
          <VStack
            width="full"
            height="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="4"
          >
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
          <Box
            display="flex"
            width="full"
            height="full"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
            justifyContent="center"
            gap="4"
          >
            <CardMeasure measure={measure} src={thumbnail.src} />
          </Box>
          <VStack display="flex" flexDirection="column" alignItems="center">
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
        </Grid>
      </PageContent>
    </Page>
  );
}
