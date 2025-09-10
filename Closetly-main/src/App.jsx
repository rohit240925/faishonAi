import React from 'react';
import Routes from './Routes';
import ThemeProvider from './components/ui/ThemeProvider';
import AuthProvider from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;