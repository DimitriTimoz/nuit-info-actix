import { Heading } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { Page, PageContent } from '@/components/Page';

export const PageSocial = () => {
  const { t } = useTranslation(['layout']);
  return (
    <Page>
      <PageContent>
        <Heading>{t('layout:mainMenu.social')}</Heading>
      </PageContent>
    </Page>
  );
};
