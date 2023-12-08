import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
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
        <Card shadow="2xl" flex={1} rounded="2xl" p={4}>
          <CardHeader>
            <Heading textAlign="center">
              {t('layout:createGame.createGame')}
            </Heading>
          </CardHeader>
          <CardBody>
            <Stack flexDir="column" gap={4}>
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
              <Logo width="400" height="300"></Logo>
              <Heading fontSize="2xl">Objectif du jeu : </Heading>
              <Text>
                Vous incarnez un dirigeant qui essaye de maintenir à flot son
                pays, votre but est d'accepter ou non les mesures qui vous
                seront proposées.
              </Text>
              <Text>
                Vos réponses auront un impact positif ou négatif sur votre
                implication dans votre lutte pour le climat, sur votre
                population et votre économie.
              </Text>
              <Text>
                Prenez cependant garde aux factions qui seront plus ou moins
                satisfaites pas vos actions, si vous n'êtes pas en bon terme
                avec eux, ils vous infligeront des malus.
              </Text>
              <Text fontWeight="bold">
                Puisse le sort vous être favorable !
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </PageContent>
    </Page>
  );
}
