import './styles/main.scss'
import { Layout } from './Layout/ui/Layout'
import { AppRouter } from './providers'

export const App = () => {
  return (
        <Layout>
          <AppRouter />
        </Layout>
  )
}
