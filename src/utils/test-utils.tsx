import '@testing-library/jest-dom'
import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'

import { setupStore } from '../store/store'
import type { AppStore, RootState } from '../store/store'
import { DialogRefProvider } from '../context/Context'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <DialogRefProvider>{children}</DialogRefProvider>
    </Provider>
  )

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
