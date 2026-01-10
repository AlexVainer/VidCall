import './styles/index.scss'
import { Layout } from './Layout/ui/Layout'
import { AppRouter } from './providers'

export const App = () => {
  return (
        <Layout>
          <AppRouter />
        </Layout>
  )
}
