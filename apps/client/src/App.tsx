import { Editor } from './pages/Editor'
import { Preview } from './pages/Preview';

function App() {

  const isPreview = window.location.pathname === '/preview';

  return isPreview ? <Preview /> : <Editor />;
}
export default App
