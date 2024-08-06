import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

import { Provider } from 'react-redux'
import { setupStore } from './store/store.ts'
import { QueryClient, QueryClientProvider } from 'react-query'
import { DialogRefProvider } from './context/Context.tsx'

const queryClient = new QueryClient()
const store = setupStore()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DialogRefProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </DialogRefProvider>
  </React.StrictMode>,
)
