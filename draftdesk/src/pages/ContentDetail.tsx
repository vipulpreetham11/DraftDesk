import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Eye, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { insforge } from '../lib/insforge';

interface Note {
  id: string;
  project_id: string;
  content: string;
  author_name: string;
  created_at: string;
}

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<any>(null);
  const [script, setScript] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [checklist, setChecklist] = useState({
    scriptDone: false,
    bRollRecorded: false,
    videoEdited: false,
    thumbnailCreated: false,
    published: false
  });

  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch project
        const { data: projectData, error: projectError } = await insforge
          .database.from('projects')
          .select('*')
          .eq('id', id)
          .single();
          
        if (projectError) throw projectError;
        setProject(projectData);
        if (projectData.checklist_state) {
          setChecklist(projectData.checklist_state);
        }
        if (projectData.thumbnail_url) {
          setThumbnailUrl(projectData.thumbnail_url);
        }

        // Fetch script
        const { data: scriptData, error: scriptError } = await insforge
          .database.from('scripts')
          .select('*')
          .eq('project_id', id)
          .single();
          
        if (scriptError && scriptError.code !== 'PGRST116') throw scriptError;
        setScript(scriptData);

        // Fetch notes
        const { data: notesData, error: notesError } = await insforge
          .database.from('notes')
          .select('*')
          .eq('project_id', id)
          .order('created_at', { ascending: false });
          
        if (notesError) throw notesError;
        if (notesData) setNotes(notesData);

      } catch (err) {
        console.error("Error fetching detail data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !id || !user) return;
    
    try {
      const payload = {
        project_id: id,
        user_id: user.id,
        content: newNote,
        author_name: user.profile?.name || (user.metadata as any)?.full_name || user.email?.split('@')[0] || 'You'
      };
      
      const { data, error } = await insforge
        .database.from('notes')
        .insert([payload])
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        setNotes([data, ...notes]);
        setNewNote('');
      }
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const toggleChecklist = async (key: keyof typeof checklist) => {
    const newState = { ...checklist, [key]: !checklist[key] };
    setChecklist(newState);
    
    if (id) {
      try {
        await insforge
          .database.from('projects')
          .update({ checklist_state: newState })
          .eq('id', id);
      } catch (err) {
        console.error("Error updating checklist", err);
      }
    }
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const totalTasks = Object.keys(checklist).length;
  const progressPercentage = Math.round((completedCount / totalTasks) * 100);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this script?");
    if (confirm && id) {
      setIsDeleting(true);
      try {
        const { error } = await insforge
          .database.from('projects')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error("Error deleting project", err);
        setIsDeleting(false);
      }
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !id) return;

    setFileName(file.name);
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${id}/thumbnail.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await insforge.storage
        .from('Thumbnail')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Storage upload error details:", uploadError);
        throw uploadError;
      }

      // Get public URL (InsForge SDK returns string directly)
      const publicUrl = insforge.storage
        .from('Thumbnail')
        .getPublicUrl(filePath);

      // Save to projects table
      const { error: dbError } = await insforge
        .database.from('projects')
        .update({ thumbnail_url: publicUrl })
        .eq('id', id);

      if (dbError) throw dbError;

      setThumbnailUrl(publicUrl);
      setToast({ message: "Thumbnail uploaded successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
      
      // Mark thumbnail as created in checklist
      if (!checklist.thumbnailCreated) {
        toggleChecklist('thumbnailCreated');
      }

    } catch (err) {
      console.error("Storage/DB upload failed, falling back to local preview:", err);
      // Fallback
      setThumbnailUrl(URL.createObjectURL(file));
      setToast({ message: "Upload failed. Using local preview.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsUploading(false);
      // Clear input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-coral-400 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Project not found</h2>
        <p className="font-body text-warm-500 mb-6">This project may have been deleted or you don't have access.</p>
        <Link to="/dashboard" className="bg-coral-400 text-white px-6 py-3 rounded-xl font-body font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col w-full pb-12">
      
      {/* TOP BAR */}
      <header className="sticky top-0 bg-warm-50/90 backdrop-blur-md z-30 border-b border-warm-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 flex-1">
            <Link 
              to="/dashboard"
              className="flex items-center gap-1.5 text-warm-500 hover:text-coral-400 transition-colors font-body text-sm font-semibold whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>

            <div className="h-6 w-[1px] bg-warm-200 hidden md:block"></div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-heading text-xl md:text-2xl font-bold text-charcoal leading-tight">
                {project.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-wider whitespace-nowrap ${
                project.status === 'published' ? 'bg-coral-400 text-white' : 'bg-amber-light text-[#8B6914]'
              }`}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button 
              onClick={() => navigate(`/edit/${id || 'demo'}`)}
              className="bg-white border border-warm-300 text-charcoal hover:bg-warm-100 font-body text-sm font-semibold px-4 py-2 rounded-[10px] flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:bg-red-50 font-body text-sm font-semibold px-4 py-2 rounded-[10px] flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT 2-COLUMN LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN: Script Content (65%) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8">
            
            {/* The Script Draft */}
            {script ? (
              <section className="bg-white rounded-xl p-6 md:p-8 border border-warm-200 shadow-sm flex flex-col gap-6">
                
                {script.hook && (
                  <div>
                    <label className="block font-heading text-xs font-bold text-warm-400 uppercase tracking-widest mb-3">
                      The Hook
                    </label>
                    <div className="bg-warm-100 p-5 rounded-r-lg border-l-[3px] border-coral-400">
                      <p className="font-body text-lg text-charcoal italic leading-relaxed whitespace-pre-wrap">
                        {script.hook}
                      </p>
                    </div>
                  </div>
                )}

                {script.body && (
                  <div>
                    <label className="block font-heading text-xs font-bold text-warm-400 uppercase tracking-widest mb-3">
                      Body Content
                    </label>
                    <div className="font-body text-base text-charcoal leading-[1.7] space-y-4 whitespace-pre-wrap">
                      {script.body}
                    </div>
                  </div>
                )}

                {script.cta && (
                  <div>
                    <label className="block font-heading text-xs font-bold text-warm-400 uppercase tracking-widest mb-3">
                      Call to Action
                    </label>
                    <p className="font-body text-base text-charcoal leading-[1.7] font-semibold whitespace-pre-wrap">
                      {script.cta}
                    </p>
                  </div>
                )}
              </section>
            ) : (
              <section className="bg-white rounded-xl p-8 border border-warm-200 shadow-sm flex flex-col items-center justify-center text-center gap-4">
                <p className="font-body text-warm-500">No script content generated yet.</p>
                <button 
                  onClick={() => navigate(`/edit/${id}`)}
                  className="bg-coral-400 hover:bg-coral-600 text-white font-body text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
                >
                  Generate Script
                </button>
              </section>
            )}

            {/* Reviewer Notes */}
            <section className="bg-warm-50 rounded-xl border border-warm-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-warm-100 px-6 py-4 border-b border-warm-200 flex justify-between items-center">
                <h3 className="font-heading text-lg font-bold text-charcoal">Reviewer Notes</h3>
                <button className="text-coral-500 hover:text-coral-700 font-body text-sm font-bold transition-colors">
                  + Add Note
                </button>
              </div>
              
              <div className="divide-y divide-warm-200">
                {notes.length === 0 ? (
                  <div className="p-6 text-center text-warm-500 font-body text-sm italic">
                    No notes yet. Add one below.
                  </div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="p-6 flex gap-4">
                      <div className="flex-1">
                        <p className="font-body text-charcoal text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="font-body text-[11px] text-warm-400 uppercase tracking-wider font-semibold">
                          Added by {note.author_name} • {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Input */}
              <div className="p-6 bg-white border-t border-warm-200 flex flex-col gap-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Type a new note here..."
                  className="w-full bg-warm-50 border border-warm-200 rounded-lg px-4 py-3 font-body text-sm text-charcoal placeholder:text-warm-400 focus:outline-none focus:border-coral-400 focus:ring-1 focus:ring-coral-400 transition-all resize-none min-h-[80px]"
                />
                <button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="self-end bg-coral-400 hover:bg-coral-600 text-white font-body text-sm font-semibold px-6 py-2.5 rounded-[10px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Add note
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Metadata & Tasks (35%) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6">
            
            {/* Publishing Progress */}
            <section className="bg-white rounded-xl p-6 border border-warm-200 shadow-sm">
              <div className="flex justify-between items-end mb-4">
                <h3 className="font-heading text-lg font-bold text-charcoal">Publishing Progress</h3>
                <span className="font-body font-bold text-coral-500">{progressPercentage}%</span>
              </div>
              
              <div className="w-full bg-warm-100 h-2 rounded-full overflow-hidden mb-6">
                <div 
                  className="bg-coral-400 h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { key: 'scriptDone', label: 'Script done' },
                  { key: 'bRollRecorded', label: 'B-roll recorded' },
                  { key: 'videoEdited', label: 'Video edited' },
                  { key: 'thumbnailCreated', label: 'Thumbnail created' },
                  { key: 'published', label: 'Published' }
                ].map((task) => (
                  <label key={task.key} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                      checklist[task.key as keyof typeof checklist] 
                        ? 'bg-coral-500 border-coral-500' 
                        : 'bg-white border-warm-300 group-hover:border-coral-300'
                    }`}>
                      {checklist[task.key as keyof typeof checklist] && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`font-body text-sm ${
                      checklist[task.key as keyof typeof checklist] ? 'text-warm-500 line-through' : 'text-charcoal'
                    }`}>
                      {task.label}
                    </span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={checklist[task.key as keyof typeof checklist]}
                      onChange={() => toggleChecklist(task.key as keyof typeof checklist)}
                    />
                  </label>
                ))}
              </div>
            </section>

            {/* Metadata */}
            <section className="bg-warm-100 rounded-xl p-6 border border-warm-200 shadow-sm">
              <h3 className="font-heading text-xs font-bold text-warm-500 uppercase tracking-widest mb-4">Metadata</h3>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-warm-200/50">
                  <span className="font-body text-sm text-warm-500">Platform</span>
                  <span className="bg-warm-200 text-charcoal px-2.5 py-1 rounded-md font-body text-xs font-bold capitalize">
                    {project.platform}
                  </span>
                </div>
                {script?.seo_tags && (
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-warm-500">Keywords</span>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[200px]">
                      {script.seo_tags.split(',').map((t: string) => (
                        <span key={t} className="font-body text-xs font-bold text-coral-500">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {script && (script.seo_title || script.seo_description) && (
              <section className="bg-white rounded-xl p-6 border border-warm-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-4 h-4 text-warm-400" />
                  <h3 className="font-heading text-xs font-bold text-warm-500 uppercase tracking-widest">SEO Preview</h3>
                </div>
                
                <div className="bg-white border border-warm-200 rounded-lg p-4 mb-4 shadow-sm">
                  <h4 className="text-[#1a0dab] font-body text-[18px] mb-1 line-clamp-1 hover:underline cursor-pointer">
                    {script.seo_title || project.title}
                  </h4>
                  <div className="text-[#006621] font-body text-[14px] mb-1 flex items-center gap-1">
                    draftdesk.app <span className="text-warm-400 text-xs">› content › view</span>
                  </div>
                  <p className="text-[#545454] font-body text-[14px] line-clamp-2 leading-snug">
                    {script.seo_description || "No description provided."}
                  </p>
                </div>
              </section>
            )}

            {/* Thumbnail Asset */}
            <section className="bg-warm-50 rounded-xl p-6 border border-warm-200 shadow-sm relative">
              <h3 className="font-heading text-xs font-bold text-warm-500 uppercase tracking-widest mb-4">Thumbnail Asset</h3>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleThumbnailUpload} 
                accept="image/*" 
                className="sr-only" 
                tabIndex={-1}
              />
              
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`w-full aspect-video bg-warm-200 rounded-xl border border-warm-300 flex flex-col items-center justify-center gap-2 relative overflow-hidden group ${isUploading ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {thumbnailUrl ? (
                  <>
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    {!isUploading && (
                      <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span className="font-body text-sm font-semibold text-white px-4 py-2 rounded-full border border-white/30">
                          Replace Image
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-coral-100 to-warm-100 opacity-50"></div>
                    <ImageIcon className="w-8 h-8 text-warm-400 relative z-10" />
                    <span className="font-body text-sm font-semibold text-charcoal relative z-10 bg-white/80 px-3 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-coral-50 group-hover:text-coral-600 transition-colors shadow-sm">
                      Upload Image
                    </span>
                  </>
                )}
                
                {/* Uploading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-coral-400 animate-spin" />
                    <span className="font-body text-sm font-bold text-coral-600">Uploading...</span>
                  </div>
                )}
              </div>
              
              <p className="font-mono text-xs text-warm-400 text-center mt-3 truncate px-2">
                {fileName || (thumbnailUrl ? 'Thumbnail applied' : 'No file selected')}
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-lg font-body text-sm font-bold z-50 animate-in slide-in-from-bottom-5 fade-in ${
          toast.type === 'success' ? 'bg-[#4ADE80] text-emerald-900' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

    </div>
  );
}
