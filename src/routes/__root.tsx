import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'AgroGame - Grow Virtual, Harvest Real' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function NotFoundComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#90EE90] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-[#4CAF50] text-center max-w-md">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-3xl font-black text-[#2E7D32] mb-2">
            404 - Field Not Found!
          </h1>
          <p className="text-gray-600 mb-6">
            Looks like this crop hasn't been planted yet...
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] text-white font-bold py-3 px-6 rounded-xl border-b-4 border-[#2E7D32] hover:brightness-110 transition-all"
          >
            🏠 Back to Farm
          </a>
        </div>
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
