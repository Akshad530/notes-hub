export interface Note {
  id: string;
  query: string;
  content: string;
  createdAt: Date;
  isPinned?: boolean;
  category?: 'Personal' | 'Work' | 'Project' | 'None';
}

export type ViewState = 'landing' | 'signup' | 'app';
