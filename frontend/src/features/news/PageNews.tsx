import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Page, PageContent } from '@/components/Page';

export const PageNews = () => {
  const { t } = useTranslation(['layout']);
  return (
    <Page>
      <PageContent>
        <Heading>{t('layout:mainMenu.news')}</Heading>
      </PageContent>
    </Page>
  );
};
