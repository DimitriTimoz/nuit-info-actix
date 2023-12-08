import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Stack,
} from '@chakra-ui/react';

import { Logo } from '@/components/Logo';
import { Page, PageContent } from '@/components/Page';

export default function PageDashboard() {
  return (
    <Page>
      <PageContent>
        <Card shadow="2xl" flex={1} rounded="2xl" p={6}>
          <CardHeader>
            <Heading textAlign="center">Create Game</Heading>
          </CardHeader>
          <CardBody>
            <Stack flexDir="column" gap={8}>
              <Button color="white" colorScheme="teal">
                New Game
              </Button>
              <Button color="white" colorScheme="teal">
                Load Game
              </Button>
              <Logo width="600" height="400"></Logo>
            </Stack>
          </CardBody>
        </Card>
      </PageContent>
    </Page>
  );
}
