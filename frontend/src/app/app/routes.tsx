import React from 'react';

import dynamic from 'next/dynamic';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import { ErrorPage } from '@/components/ErrorPage';
import { Layout } from '@/layout/Layout';
import { Loader } from '@/layout/Loader';


export const routes = [
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <>
        <Outlet />
      </>
    ),
  },
  { path: '*', element: <ErrorPage errorCode={404} /> },
] satisfies RouteObject[];
