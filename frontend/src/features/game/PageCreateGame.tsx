import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { FieldInput } from '@/components/FieldInput';
import { Logo } from '@/components/Logo';
import { Page, PageContent } from '@/components/Page';
import { useToastError } from '@/components/Toast';
import { useCreateGame } from '@/features/game/service';

export default function PageDashboard() {
  const form = useForm({
    onValidSubmit: (e) => {
      createGame(e.pseudo);
    },
  });
  const { t } = useTranslation(['layout']);
  const navigate = useNavigate();
  const toastError = useToastError();
  const { mutate: createGame, isLoading } = useCreateGame({
    onSuccess: (token: string) => {
      !token.length
        ? toastError({ title: 'Pas de session créé' })
        : navigate('/dashboard');
    },
  });
  return (
    <Page isFocusMode>
      <PageContent>
        <Card shadow="2xl" flex={1} rounded="2xl" p={6}>
          <CardHeader>
            <Heading textAlign="center">
              {t('layout:createGame.createGame')}
            </Heading>
          </CardHeader>
          <CardBody>
            <Stack flexDir="column" gap={8}>
              <Formiz connect={form} autoForm>
                <Stack spacing={4}>
                  <FieldInput
                    name="pseudo"
                    label={t('layout:createGame.username')}
                    placeholder={t('layout:createGame.enterUsername')}
                    required={t('layout:createGame.requiredUsername')}
                  />
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    color="white"
                    colorScheme="teal"
                  >
                    {t('layout:createGame.newGame')}
                  </Button>
                </Stack>
              </Formiz>
              <Logo width="600" height="400"></Logo>
            </Stack>
          </CardBody>
        </Card>
      </PageContent>
    </Page>
  );
}
