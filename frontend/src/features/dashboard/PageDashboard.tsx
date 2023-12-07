import React from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Grid,
  HStack,
  Heading,
  Image,
  Img,
  Progress,
  StackDivider,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Page, PageContent } from '@/components/Page';
import { useHelloWorld } from '@/features/dashboard/service';
import { Loader } from '@/layout/Loader';

export default function PageDashboard() {
  const { t } = useTranslation(['dashboard']);
  const { data, isLoading, refetch } = useHelloWorld();

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
          templateColumns={{ base: '1fr', md: '1fr 4fr 1fr' }}
          templateRows={{ base: '1fr 1fr 1fr', md: '1fr' }}
          gap="4"
          placeItems="center"
          justifyContent="center"
        >
          <Box
            width="full"
            height="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="4"
          >
            <Progress value={50} size="md" width="full" />
            <Progress value={50} size="md" width="full" />
            <Progress value={50} size="md" width="full" />
          </Box>
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
              width={{ base: '90%', sm: '80%', md: '65%', lg: '50%' }}
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
                    aspectRatio={1 / 1}
                    src="https://via.placeholder.com/150"
                    m="4"
                    rounded="md"
                  />
                </Box>
              </CardBody>
              <CardFooter display="flex" justify="center" gap="6">
                <Button colorScheme="teal" size="sm">
                  Accepter
                </Button>
                <Button colorScheme="teal" size="sm">
                  Refuser
                </Button>
              </CardFooter>
            </Card>
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
