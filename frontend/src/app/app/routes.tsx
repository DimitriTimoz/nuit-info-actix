import React from 'react';

import { Outlet, RouteObject } from 'react-router-dom';

import { ErrorPage } from '@/components/ErrorPage';
import PageDashboard from '@/features/dashboard/PageDashboard';
import { Layout } from '@/layout/Layout';

export const routes = [
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      {
        path: '',
        element: <PageDashboard />,
      },
    ],
  },
  { path: '*', element: <ErrorPage errorCode={404} /> },
] satisfies RouteObject[];
