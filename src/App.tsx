/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { NotesHubApp } from './components/NotesHubApp';
import { SignUp } from './components/SignUp';
import { ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>(() => (
    localStorage.getItem('notes-hub-authenticated') === 'true' ? 'app' : 'landing'
  ));

  const handleSignUp = () => {
    localStorage.setItem('notes-hub-authenticated', 'true');
    setView('app');
  };

  useEffect(() => {
    if (view === 'app') {
      localStorage.setItem('notes-hub-authenticated', 'true');
    }
  }, [view]);

  if (view === 'landing') {
    return <Landing onGetStarted={() => setView('signup')} />;
  }

  if (view === 'signup') {
    return <SignUp onSignUp={handleSignUp} />;
  }

  return <NotesHubApp />;
}
