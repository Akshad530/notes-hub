/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Landing } from './components/Landing';
import { NotesHubApp } from './components/NotesHubApp';
import { ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');

  if (view === 'landing') {
    return <Landing onGetStarted={() => setView('app')} />;
  }

  return <NotesHubApp />;
}

