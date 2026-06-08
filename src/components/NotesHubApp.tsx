import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Settings, Trash2, Bold, Italic, List, 
  ArrowUp, Edit3, Save, Compass, PanelLeftClose, Mic, Globe, Plus,
  Share, Download, Eye, Code, Check, Pin, PinOff, Image as ImageIcon, X,
  Volume2, Square, Menu
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isToday, isYesterday } from 'date-fns';
import { Note } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HexagonLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <path d="M11 21 L11 14 L6 11" />
    <path d="M4 7 L9 10 L13 8" />
    <path d="M20 7 L15 10 L15 16" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
  </svg>
);

export function NotesHubApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Personal' | 'Work' | 'Project'>('All');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSavedData, setShowSavedData] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<{ data: string, mimeType: string, previewUrl: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const [prefix, base64] = dataUrl.split(',');
      const mimeType = prefix.split(':')[1].split(';')[0];
      setAttachedImage({ data: base64, mimeType, previewUrl: dataUrl });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load from local storage initially (mock DB)
  useEffect(() => {
    const saved = localStorage.getItem('notes-hub-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed.map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) })));
      } catch (e) {}
    }
    // Simulate loading for skeleton
    setTimeout(() => setIsLoadingInitial(false), 800);
  }, []);

  // Save to local storage when notes change
  useEffect(() => {
    if (!isLoadingInitial) {
      localStorage.setItem('notes-hub-history', JSON.stringify(notes));
    }
  }, [notes, isLoadingInitial]);

  // Clean up speech synthesis on note switch or unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [activeNote?.id]);

  const handleListen = () => {
    if (!activeNote || !activeNote.content) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Strip markdown characters for better reading
    const cleanText = activeNote.content.replace(/[#_*>`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleGenerate = async (queryOverride?: string) => {
    const query = queryOverride || inputValue;
    if ((!query.trim() && !attachedImage) || isGenerating) return;

    setInputValue('');
    const currentImage = attachedImage;
    setAttachedImage(null);
    setIsGenerating(true);
    setIsEditing(false);

    const loadingNote: Note = {
      id: Date.now().toString(),
      query: query,
      content: '', // Empty initially
      createdAt: new Date(),
    };
    
    // Optimistically set active note
    setActiveNote(loadingNote);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: query,
          image: currentImage ? { data: currentImage.data, mimeType: currentImage.mimeType } : undefined 
        }),
      });

      const data = await response.json();
      const content = data.text || 'Error: No content returned.';

      const newNote: Note = {
        ...loadingNote,
        content: content,
      };

      setNotes(prev => [newNote, ...prev]);
      setActiveNote(newNote);
    } catch (error) {
      console.error(error);
      const errorNote: Note = {
        ...loadingNote,
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setActiveNote(errorNote);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearWorkspace = () => {
    setActiveNote(null);
    setIsEditing(false);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    if (activeNote) {
      setEditContent(activeNote.content);
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    if (activeNote) {
      const updatedNote = { ...activeNote, content: editContent };
      setActiveNote(updatedNote);
      setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
      setIsEditing(false);
      setShowSavedData(true);
      setTimeout(() => setShowSavedData(false), 2000);
    }
  };

  const exportNote = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.query.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
    if (activeNote?.id === id) {
      setActiveNote(prev => prev ? { ...prev, isPinned: !prev.isPinned } : null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isEditing) saveEdit();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (activeNote && !isEditing) startEditing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, activeNote, editContent]);

  const startDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsDictating(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsDictating(false);
    };
    
    recognition.onend = () => {
      setIsDictating(false);
    };
    
    recognition.start();
  };

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = editContent;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    setEditContent(newText);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 0);
  };

  const filteredNotes = useMemo(() => {
    let result = notes;
    if (activeCategoryFilter !== 'All') {
      result = result.filter(n => n.category === activeCategoryFilter);
    }
    if (!searchQuery.trim()) return result;
    const lowerQ = searchQuery.toLowerCase();
    return result.filter(n => n.query.toLowerCase().includes(lowerQ) || n.content.toLowerCase().includes(lowerQ));
  }, [notes, searchQuery, activeCategoryFilter]);

  const todayNotes = filteredNotes.filter(n => !n.isPinned && isToday(n.createdAt));
  const yesterdayNotes = filteredNotes.filter(n => !n.isPinned && isYesterday(n.createdAt));
  const earlierNotes = filteredNotes.filter(n => !n.isPinned && !isToday(n.createdAt) && !isYesterday(n.createdAt));
  const pinnedNotes = filteredNotes.filter(n => n.isPinned);

  const renderNotesGroup = (title: string, groupNotes: Note[]) => {
    if (groupNotes.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-[11px] font-bold text-slate-900 mb-2 px-2 flex items-center space-x-1">
          <svg className="w-3 h-3 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          <span>{title}</span>
        </h3>
        <div className="space-y-0.5">
          {groupNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => { setActiveNote(note); setIsEditing(false); setIsMobileMenuOpen(false); }}
              className={cn(
                "group cursor-pointer rounded-lg px-2 py-1.5 flex flex-col gap-1 transition-all",
                activeNote?.id === note.id ? "bg-black text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={cn("text-sm truncate flex-1", activeNote?.id === note.id ? "font-medium" : "")}>{note.query}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => togglePin(note.id, e)} className="p-0.5 hover:bg-black/10 rounded transition-all">
                     <Pin className={cn("w-3 h-3", note.isPinned ? "fill-current" : "")} />
                   </button>
                   <button onClick={(e) => deleteNote(note.id, e)} className="p-0.5 hover:bg-black/10 rounded transition-all">
                     <Trash2 className="w-3 h-3" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden font-sans text-slate-900 relative">
        
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "w-[280px] sm:w-[300px] bg-[#f8fafc] flex-shrink-0 flex flex-col border-r border-slate-200 shadow-[inset_-2px_0_10px_rgba(0,0,0,0.01)] h-full absolute md:relative z-30 transition-transform duration-300 left-0 top-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="px-6 pt-7 pb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3 text-slate-800">
                <HexagonLogo className="w-8 h-8 drop-shadow-sm text-slate-900" />
                <span className="font-extrabold text-xl tracking-tight font-sans">Note Hub</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 p-2 rounded-xl transition-all md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
              <button className="hidden md:block text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 p-2 rounded-xl transition-all">
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
            
            <button onClick={clearWorkspace} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 px-4 flex items-center justify-between text-sm transition-all shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 mb-6 group">
              <div className="flex items-center space-x-3">
                <Edit3 className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                <span className="font-semibold tracking-wide text-[15px]">New note</span>
              </div>
              <div className="flex items-center space-x-1 opacity-60 text-[10px]">
                <span className="bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">⌘</span>
                <span className="bg-white/10 px-1.5 py-0.5 rounded-md border border-white/10">T</span>
              </div>
            </button>
            
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-slate-700 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white hover:bg-white border border-slate-200/80 focus:border-slate-300 focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 text-slate-800 shadow-sm"
              />
              {!searchQuery && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 text-slate-400 text-[10px] font-medium tracking-widest">
                  <span className="px-1 py-0.5 rounded">⌘F</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 space-y-1">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Library</div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 mt-1">
             {isLoadingInitial ? (
               <div className="space-y-6 px-2 py-4">
                 <div className="space-y-3">
                   <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                   <div className="space-y-4 pt-2">
                     <div className="h-3 bg-slate-200 rounded w-[90%]"></div>
                     <div className="h-3 bg-slate-200 rounded w-full"></div>
                     <div className="h-3 bg-slate-200 rounded w-[80%]"></div>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="space-y-6 pb-6 pt-1">
                 {pinnedNotes.length > 0 && renderNotesGroup('Pinned', pinnedNotes)}
                 {todayNotes.length > 0 && renderNotesGroup('Today', todayNotes)}
                 {yesterdayNotes.length > 0 && renderNotesGroup('Yesterday', yesterdayNotes)}
                 {earlierNotes.length > 0 && renderNotesGroup('Earlier', earlierNotes)}
               </div>
             )}
          </div>
          
          <div className="p-4 mt-auto border-t border-slate-200/60 bg-[#f8fafc] space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-200/50 text-slate-600 transition-colors group">
                 <div className="flex items-center space-x-3">
                   <div className="w-6 h-6 flex items-center justify-center bg-white shadow-sm rounded-md border border-slate-200 group-hover:border-slate-300 transition-colors">
                     <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 4.12 2.16 6.66-5.66 4.13-5.66-4.13L6.34 6.81z"></path></svg>
                   </div>
                   <span className="text-[13px] font-semibold text-slate-700 tracking-wide">Favorites</span>
                 </div>
              </button>
              
              <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-200/50 text-slate-600 transition-colors group">
                 <div className="flex items-center space-x-3">
                   <div className="w-6 h-6 flex items-center justify-center bg-slate-800 shadow-sm rounded-md border border-slate-700 group-hover:bg-slate-900 transition-colors">
                     <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                   </div>
                   <span className="text-[13px] font-semibold text-slate-700 tracking-wide">Settings</span>
                 </div>
              </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white w-full overflow-hidden">
          <div className="h-16 px-4 md:px-6 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="p-2 -ml-2 text-slate-500 hover:text-slate-800 md:hidden rounded-lg hover:bg-slate-100"
               >
                 <Menu className="w-5 h-5"/>
               </button>
               <div className="text-slate-500 text-sm font-semibold flex items-center gap-2.5">
                 <HexagonLogo className="w-5 h-5 text-slate-700 drop-shadow-sm hidden sm:block" />
                 <span className="text-slate-800">Note Hub</span>
               </div>
             </div>
             <button className="flex items-center space-x-2.5 border border-slate-200/80 hover:border-slate-300 rounded-full px-3 md:px-4 py-1.5 text-xs md:text-sm font-semibold text-slate-800 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-white hover:-translate-y-0.5 group">
               <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></span>
               </div>
               <span className="tracking-wide">Upgrade AI</span>
             </button>
          </div>
          
          <div className="flex-1 overflow-auto flex flex-col relative w-full h-full justify-between">
             {activeNote ? (
               <div className="flex-1 flex flex-col w-full px-4 sm:px-8 py-6 sm:py-8 pb-32 relative">
                  {/* Note Viewer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-100 gap-4">
                     <div className="flex items-center gap-3 w-full overflow-hidden">
                       <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 truncate shrink-1">{activeNote.query}</h1>
                       
                       {isEditing ? (
                         <select 
                           value={activeNote.category || 'None'} 
                           onChange={(e) => setActiveNote({...activeNote, category: e.target.value as any})}
                           className="text-xs font-semibold px-2 py-1 bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-slate-400 text-slate-600 appearance-none cursor-pointer"
                         >
                           <option value="None">No Category</option>
                           <option value="Personal">Personal</option>
                           <option value="Work">Work</option>
                           <option value="Project">Project</option>
                         </select>
                       ) : activeNote.category && activeNote.category !== 'None' ? (
                         <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200/60 shrink-0 hidden sm:inline-flex">
                           {activeNote.category}
                         </span>
                       ) : null}

                       {showSavedData && (
                          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 animate-in fade-in slide-in-from-bottom-1 border border-emerald-100">
                            <Check className="w-3 h-3" /> Saved
                          </div>
                       )}
                     </div>
                     
                     <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1 shrink-0 overflow-x-auto">
                        {isEditing ? (
                          <>
                             <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={cn("p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 transition-all", isPreviewMode && "bg-white shadow-sm text-slate-900")}>
                               {isPreviewMode ? <Code className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                             </button>
                             <div className="w-px h-6 bg-slate-200 mx-1 my-auto"></div>
                             <button onClick={() => insertFormatting('**')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600"><Bold className="w-4 h-4"/></button>
                             <button onClick={() => insertFormatting('_')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600"><Italic className="w-4 h-4"/></button>
                             <button onClick={() => insertFormatting('- ')} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600"><List className="w-4 h-4"/></button>
                             <div className="w-px h-6 bg-slate-200 mx-1 my-auto"></div>
                             <button onClick={saveEdit} className="p-1.5 bg-black hover:bg-slate-800 text-white rounded font-medium text-xs flex items-center gap-1 px-3 shadow-sm transition-colors"><Save className="w-3.5 h-3.5"/> Save</button>
                             <button onClick={() => setIsEditing(false)} className="p-1.5 hover:bg-slate-200 rounded font-medium text-xs text-slate-600 px-3 transition-colors">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={handleListen} className={cn("p-1.5 hover:bg-white hover:shadow-sm rounded flex items-center gap-1.5 px-2 font-medium text-sm transition-all text-xs", isSpeaking ? "text-indigo-600 bg-indigo-50" : "text-slate-600")}>
                              {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                              <span className="hidden lg:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
                            </button>
                            <button onClick={shareNote} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 flex items-center gap-1.5 px-2 font-medium text-sm transition-all text-xs relative">
                              {showCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share className="w-3.5 h-3.5" />}
                              <span className="hidden lg:inline">{showCopied ? 'Copied' : 'Share'}</span>
                            </button>
                            <button onClick={exportNote} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-slate-600 flex items-center gap-1.5 px-2 font-medium text-sm transition-all text-xs">
                              <Download className="w-3.5 h-3.5" />
                              <span className="hidden lg:inline">Export</span>
                            </button>
                            <div className="w-px h-6 bg-slate-200 mx-1 my-auto"></div>
                            <button onClick={startEditing} className="p-1.5 hover:bg-white hover:shadow-sm rounded text-black flex items-center gap-1.5 px-3 font-medium text-[13px] transition-all"><Edit3 className="w-3.5 h-3.5"/> Edit</button>
                            <div className="w-px h-6 bg-slate-200 mx-1 my-auto"></div>
                            <button onClick={(e) => deleteNote(activeNote.id, e)} className="p-1.5 hover:bg-white hover:text-red-500 hover:shadow-sm rounded text-slate-400 transition-all"><Trash2 className="w-4 h-4"/></button>
                          </>
                        )}
                     </div>
                  </div>
                  
                  <div className="flex-1 w-full overflow-y-auto">
                    {isGenerating && activeNote.content === '' ? (
                      <div className="space-y-6 pt-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                        <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
                        
                        <div className="space-y-4 pt-4">
                          <div className="h-4 bg-slate-100 rounded animate-pulse w-2/3"></div>
                          <div className="h-4 bg-slate-100 rounded animate-pulse w-full"></div>
                          <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ) : isEditing && !isPreviewMode ? (
                      <textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full h-full min-h-[400px] resize-none outline-none text-slate-700 leading-relaxed font-sans placeholder:text-slate-300 border border-slate-200 rounded-xl p-4 focus:border-slate-400 focus:ring-1 focus:ring-slate-200 transition-all"
                        placeholder="Write your note here using Markdown..."
                      />
                    ) : (
                      <article className="prose prose-slate max-w-none w-full prose-p:leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-black prose-li:marker:text-slate-300">
                        <ReactMarkdown
                          components={{
                            strong({node, children, ...props}) {
                              return <strong className="bg-amber-100/80 text-amber-900 font-bold px-1.5 py-0.5 rounded-md shadow-sm border border-amber-200/50" {...props}>{children}</strong>
                            },
                            code({node, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '');
                              // we cast inline loosely since react-markdown typings handle it internally differently
                              const isInline = !match;
                              return !isInline && match ? (
                                <SyntaxHighlighter
                                  style={vscDarkPlus as any}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-xl overflow-hidden shadow-sm !my-4 text-sm"
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={cn("bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded-md font-mono text-sm", className)} {...props}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {isEditing && isPreviewMode ? editContent : activeNote.content}
                        </ReactMarkdown>
                      </article>
                    )}
                  </div>
               </div>
             ) : (
               /* Empty State */
               <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[300px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-slate-200/50 rounded-full blur-3xl opacity-50 animate-[pulse_6s_ease-in-out_infinite] pointer-events-none -z-10"></div>
                  
                  <div className="relative mb-6 z-10 flex flex-col items-center group shrink-0">
                    <HexagonLogo className="w-16 h-16 text-slate-800 drop-shadow-sm mb-4" />
                    
                    <div className="px-5 py-2 rounded-full border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-2.5 transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-800"></span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 tracking-widest uppercase">Introducing Note Hub</span>
                    </div>
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-medium text-slate-900 tracking-[-0.03em] mb-1.5 text-center leading-tight shrink-0">
                    Built to think.
                  </h1>
                  <h2 className="text-3xl sm:text-4xl font-medium text-slate-400 tracking-[-0.03em] mb-8 text-center leading-tight text-opacity-80 shrink-0">
                    Designed to assist.
                  </h2>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-4 shrink-0">
                    <button onClick={() => setInputValue('Generate rest API')} className="flex items-center space-x-2 border border-slate-200 hover:border-slate-300 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:shadow-sm bg-white">
                       <span className="text-slate-500"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span>
                       <span className="font-semibold text-slate-800">Generate API</span>
                    </button>
                    <button onClick={() => setInputValue('Debug Python code')} className="flex items-center space-x-2 border border-blue-100 hover:border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-50/50 hover:shadow-sm bg-blue-50/30">
                       <span className="text-blue-500"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg></span>
                       <span className="font-semibold text-blue-800">Debug Code</span>
                    </button>
                    <button onClick={() => setInputValue('Explain React hooks')} className="flex items-center space-x-2 border border-emerald-100 hover:border-emerald-200 rounded-full px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-50/50 hover:shadow-sm bg-emerald-50/30">
                       <span className="text-emerald-500"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></span>
                       <span className="font-semibold text-emerald-800">Explain Hooks</span>
                    </button>
                  </div>
               </div>
             )}
             
             {/* Always show input footer */}
             <div className="w-full max-w-2xl px-4 sm:px-6 pb-6 mt-auto shrink-0 relative z-20 mx-auto mb-2">
                <div className="relative rounded-[22px] p-[1.5px] bg-[linear-gradient(to_right,#e2e8f0,#f8fafc,#e2e8f0)] bg-[length:200%_auto] focus-within:bg-[linear-gradient(to_right,#60a5fa,#a78bfa,#34d399,#60a5fa)] focus-within:animate-gradient shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus-within:shadow-[0_8px_40px_rgba(99,102,241,0.15)] transition-all duration-500 transform-gpu hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
                  <div className="bg-white/95 backdrop-blur-xl rounded-[20.5px] p-3 flex flex-col w-full relative z-10">
                      {attachedImage && (
                        <div className="relative w-20 h-20 mb-3 ml-2 mt-1 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm transition-all group">
                          <img src={attachedImage.previewUrl} alt="Attached" className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-col gap-1">
                            <button 
                              onClick={() => setAttachedImage(null)}
                              className="bg-black/60 text-white rounded-full p-1 hover:bg-red-500 hover:scale-110 transition-all shadow-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                     <textarea
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter' && !e.shiftKey) {
                           e.preventDefault();
                           handleGenerate();
                         }
                       }}
                       placeholder="Type / for command or upload image..."
                       className="w-full bg-transparent resize-none outline-none border-none text-slate-800 placeholder:text-slate-400 mb-2 px-2 min-h-[44px] text-[15px]"
                       rows={1}
                       disabled={isGenerating}
                     />
                     <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-3 pl-2">
                         <input 
                           type="file" 
                           ref={fileInputRef} 
                           onChange={handleFileChange} 
                           accept="image/*" 
                           className="hidden" 
                         />
                         <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-[13px] font-semibold transition-colors"
                         >
                           <ImageIcon className="w-4 h-4 text-slate-500" />
                           <span>Upload</span>
                         </button>
                         <button className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 text-[13px] font-semibold transition-colors">
                           <Globe className="w-4 h-4 text-slate-500" />
                           <span>Search</span>
                         </button>
                       </div>
                       <div className="flex items-center space-x-2">
                         <button 
                           onClick={startDictation}
                           className={cn("text-slate-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100", isDictating && "text-red-500 bg-red-50 animate-pulse")}
                         >
                           <Mic className="w-5 h-5"/>
                         </button>
                         <button 
                           onClick={() => handleGenerate()}
                           disabled={(!inputValue.trim() && !attachedImage) || isGenerating}
                           className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white flex items-center justify-center transition-all shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] ml-2 disabled:shadow-none hover:-translate-y-0.5"
                         >
                           {isGenerating ? (
                             <div className="flex space-x-1">
                               <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                               <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                               <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                             </div>
                           ) : (
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="5 12 19 12"></polyline><polyline points="12 5 19 12 12 19"></polyline></svg>
                           )}
                         </button>
                       </div>
                     </div>
                  </div>
                </div>
                <div className="text-center mt-5">
                  <p className="text-[11px] text-slate-400 font-medium">
                    Note Hub may make mistakes. We recommend checking important information. <a href="#" className="underline hover:text-slate-600 transition-colors">Privacy Notice</a>
                  </p>
                </div>
              </div>

          </div>
        </div>
    </div>
  );
}
