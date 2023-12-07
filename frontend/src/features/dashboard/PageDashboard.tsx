import React from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Text,
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
    <Page>
      <PageContent>
        <Heading size="md" mb="4">
          {t('dashboard:title')}
        </Heading>
        {isLoading && <Loader />}
        <Button onClick={() => refetch()}>Refetch</Button>
      </PageContent>
    </Page>
  );
}
