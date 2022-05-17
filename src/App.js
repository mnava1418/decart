import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Root from './Root';
import Terms from './components/Terms';
import NotFound from './components/NotFound';
import { PATHS } from './config';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.index} element={<Root />} />
        <Route path={PATHS.terms} element={<Terms />} />
        <Route path= "*" element={<NotFound />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
