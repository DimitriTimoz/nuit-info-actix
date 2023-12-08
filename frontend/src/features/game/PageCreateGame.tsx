import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useTranslation } from 'react-i18next';

import { FieldInput } from '@/components/FieldInput';
import { Logo } from '@/components/Logo';
import { Page, PageContent } from '@/components/Page';

export default function PageDashboard() {
  const form = useForm({ onSubmit: console.log });
  const { t } = useTranslation(['layout']);
  return (
    <Page>
      <PageContent>
        <Card shadow="2xl" flex={1} rounded="2xl" p={6}>
          <CardHeader>
            <Heading textAlign="center">
              {t('layout:createGame.createGame')}
            </Heading>
          </CardHeader>
          <CardBody>
            <Stack flexDir="column" gap={8}>
              <Button color="white" colorScheme="teal">
                {t('layout:createGame.newGame')}
              </Button>
              <Formiz connect={form} autoForm>
                <FieldInput
                  name="username"
                  label={t('layout:createGame.username')}
                  placeholder={t('layout:createGame.enterUsername')}
                  required={t('layout:createGame.requiredUsername')}
                ></FieldInput>
              </Formiz>
              <Logo width="600" height="400"></Logo>
            </Stack>
          </CardBody>
        </Card>
      </PageContent>
    </Page>
  );
}
