import React from 'react';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Grid,
  Heading,
  Image,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Page, PageContent } from '@/components/Page';
import { useHelloWorld } from '@/features/dashboard/service';

import thumbnail from '/assets/thumbnail.png';

export default function PageDashboard() {
  const { t } = useTranslation(['layout']);
  const { data } = useHelloWorld();

  console.log(data);
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
              <Heading size="md">{t('layout:dashboard.environement')}</Heading>
              <Progress value={50} size="md" width="full" />
            </VStack>

            <VStack width="full" mb="4">
              <Heading size="md">{t('layout:dashboard.social')}</Heading>
              <Progress value={50} size="md" width="full" />
            </VStack>

            <VStack width="full" mb="4">
              <Heading size="md">{t('layout:dashboard.economy')}</Heading>
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
            <Card
              width={{ base: '90%', sm: '80%', md: '65%' }}
              height="fit-content"
            >
              <CardBody>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyItems="center"
                >
                  <Text textAlign="center">
                    Culpa commodo velit proident do proident cupidatat in sint.
                    Incididunt nostrud ipsum ut ullamco. Enim in adipisicing
                    nostrud ea ex fugiat sit labore tempor voluptate amet
                    proident.
                  </Text>
                  <Image
                    aspectRatio={'1 / 1'}
                    src={thumbnail.src}
                    alt="thumbnail"
                    mx="12"
                    my="4"
                    rounded="md"
                  />
                </Box>
              </CardBody>
              <CardFooter display="flex" justify="center" gap="6">
                <Button colorScheme="teal" size="sm">
                  {t('layout:dashboard.accept')}
                </Button>
                <Button colorScheme="teal" size="sm">
                  {t('layout:dashboard.reject')}
                </Button>
              </CardFooter>
            </Card>
          </Box>
          <VStack display="flex" flexDirection="column" alignItems="flex-start">
            <Heading size="lg">{t('layout:dashboard.affinity')}</Heading>
            <Box>
              <Heading size="md">{t('layout:dashboard.scientists')}</Heading>
              <Text>50%</Text>
            </Box>
            <Box>
              <Heading size="md">{t('layout:dashboard.united_nation')}</Heading>
              <Text>50%</Text>
            </Box>
            <Box>
              <Heading size="md">{t('layout:dashboard.cartel')}</Heading>
              <Text>50%</Text>
            </Box>
          </VStack>
        </Grid>
      </PageContent>
    </Page>
  );
}
