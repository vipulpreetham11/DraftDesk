import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { insforge } from '../lib/insforge';
import { 
  ArrowLeft, ChevronDown, Save, Sparkles, 
  Film, Plus, Search, X, Calendar as CalendarIcon
} from 'lucide-react';

const AutoResizeTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={textareaRef}
      onChange={(e) => {
        resize();
        if (props.onChange) props.onChange(e);
      }}
      className={`w-full bg-transparent border-none focus:ring-0 resize-none overflow-hidden font-body text-base text-charcoal placeholder:text-warm-400 p-0 ${props.className || ''}`}
      rows={1}
    />
  );
};

export default function ScriptEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  // State
  const [title, setTitle] = useState('Untitled Script');
  const [status, setStatus] = useState('idea');
  const [platform, setPlatform] = useState('youtube');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Script content state
  const [hook, setHook] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [cta, setCta] = useState('');
  
  // SEO state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // B-Roll State
  const [bRollItems, setBRollItems] = useState<string[]>([]);

  // Target Date
  const [targetDate, setTargetDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  // Toast
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    if (id && user) {
      const fetchScript = async () => {
        try {
          const { data: projectData, error: projectError } = await insforge
            .database.from('projects')
            .select('*')
            .eq('id', id)
            .single();
            
          if (projectError) throw projectError;
          
          if (projectData) {
            setTitle(projectData.title);
            setStatus(projectData.status);
            setPlatform(projectData.platform);
            if (projectData.target_date) setTargetDate(projectData.target_date);
          }

          const { data: scriptData, error: scriptError } = await insforge
            .database.from('scripts')
            .select('*')
            .eq('project_id', id)
            .single();

          if (scriptError && scriptError.code !== 'PGRST116') throw scriptError;
          
          if (scriptData) {
            setHook(scriptData.hook || '');
            setBodyContent(scriptData.body || '');
            setCta(scriptData.cta || '');
            setSeoTitle(scriptData.seo_title || '');
            setSeoDesc(scriptData.seo_description || '');
            if (scriptData.seo_tags) {
              setTags(scriptData.seo_tags.split(',').filter(Boolean));
            }
            if (scriptData.broll_notes) {
              setBRollItems(scriptData.broll_notes.split(',').map((s: string) => s.trim()).filter(Boolean));
            }
            setHasGenerated(true);
          }
        } catch (err) {
          console.error("Error fetching script", err);
        }
      };
      fetchScript();
    }
  }, [id, user]);

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;
    setIsGenerating(true);
    setHasGenerated(false);
    
    try {
      // Fetch user's profile for niche and style notes
      const { data: profile } = await insforge.database
        .from('profiles')
        .select('niche, style_notes')
        .eq('id', user.id)
        .single();

      // Call API
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          niche: profile?.niche || '',
          style_notes: profile?.style_notes || '',
          platform
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to generate script');
      }

      const generated = await res.json();
      
      setHook(generated.hook || '');
      setBodyContent(generated.body || '');
      setCta(generated.cta || '');
      
      if (generated.broll_notes) {
        setBRollItems(generated.broll_notes.split(',').map((s: string) => s.trim()).filter(Boolean));
      } else {
        setBRollItems([]);
      }
      
      setSeoTitle(generated.seo_title || '');
      setSeoDesc(generated.seo_description || '');
      
      if (generated.seo_tags) {
        setTags(generated.seo_tags.split(',').map((s: string) => s.trim()).filter(Boolean));
      } else {
        setTags([]);
      }
      
      setIsGenerating(false);
      setHasGenerated(true);
      setToast({ message: "Script generated successfully!", type: "success" });
      setTimeout(() => setToast(null), 3000);
      
    } catch (err: any) {
      console.error(err);
      setIsGenerating(false);
      setToast({ message: err.message || "Script generation failed. Try again?", type: "error" });
      setTimeout(() => setToast(null), 5000);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      let currentProjectId = id;
      
      // Upsert Project
      const projectPayload: any = {
        title,
        status,
        platform,
        target_date: targetDate || null,
        user_id: user.id
      };
      
      if (currentProjectId) {
        projectPayload.id = currentProjectId;
      }
      
      const { data: projectData, error: projectError } = await insforge
        .database.from('projects')
        .upsert(projectPayload)
        .select()
        .single();
        
      if (projectError) throw projectError;
      currentProjectId = projectData.id;

      // Upsert Script
      const scriptPayload: any = {
        project_id: currentProjectId,
        hook,
        body: bodyContent,
        cta,
        broll_notes: bRollItems.join(','),
        seo_title: seoTitle,
        seo_description: seoDesc,
        seo_tags: tags.join(','),
      };
      
      const { error: scriptError } = await insforge
        .database.from('scripts')
        .upsert(scriptPayload, { onConflict: 'project_id' });
        
      if (scriptError) throw scriptError;
      
      setToast({ message: "Script saved!", type: "success" });
      setTimeout(() => setToast(null), 3000);

      // Always navigate to content detail page after successful save
      navigate(`/content/${currentProjectId}`);
    } catch (err: any) {
      console.error("Error saving script", err);
      setToast({ message: err?.message || "Failed to save script", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const addBRollMarker = () => {
    setBRollItems([...bRollItems, '']);
  };

  const updateBRollMarker = (index: number, value: string) => {
    const newItems = [...bRollItems];
    newItems[index] = value;
    setBRollItems(newItems);
  };

  const removeBRollMarker = (index: number) => {
    setBRollItems(bRollItems.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col w-full">
      
      {/* TOP BAR */}
      <header className="sticky top-0 bg-warm-50/90 backdrop-blur-md z-30 border-b border-warm-200 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto flex-1">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-warm-500 hover:text-coral-400 transition-colors font-body text-sm font-semibold whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="h-6 w-[1px] bg-warm-200 hidden md:block"></div>

            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-heading text-xl md:text-2xl font-bold text-coral-600 bg-transparent border border-transparent hover:border-warm-200 focus:border-coral-400 focus:bg-white focus:ring-2 focus:ring-coral-400/20 rounded-md px-2 py-1 outline-none w-full max-w-md transition-all cursor-text"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] font-bold text-charcoal uppercase tracking-wider hidden md:inline-block">Status</span>
              <div className="relative">
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="appearance-none bg-warm-200 text-charcoal font-body text-sm font-semibold rounded-lg pl-3 pr-8 py-2 border-none focus:ring-2 focus:ring-coral-400 outline-none"
                >
                  <option value="idea">Idea</option>
                  <option value="scripted">Scripted</option>
                  <option value="recorded">Recorded</option>
                  <option value="edited">Edited</option>
                  <option value="published">Published</option>
                </select>
                <ChevronDown className="w-4 h-4 text-charcoal absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-body text-[10px] font-bold text-charcoal uppercase tracking-wider hidden md:inline-block">Platform</span>
              <div className="relative">
                <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="appearance-none bg-warm-200 text-charcoal font-body text-sm font-semibold rounded-lg pl-3 pr-8 py-2 border-none focus:ring-2 focus:ring-coral-400 outline-none"
                >
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="w-4 h-4 text-charcoal absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-coral-600 hover:bg-coral-800 text-white font-body text-sm font-semibold px-5 py-2 rounded-[10px] flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
              <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT 2-COLUMN LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          
          {/* LEFT COLUMN: Script Generation & Editing (60%) */}
          <div className="w-full md:w-[60%] flex flex-col gap-6">
            
            {/* Topic Input */}
            <section className="bg-warm-100 rounded-xl p-4 md:p-6 border border-warm-200 shadow-sm">
              <label className="block font-heading text-xs font-bold text-warm-500 uppercase tracking-widest mb-3">
                What's the topic?
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 5 Productivity hacks for remote designers"
                  className="flex-1 bg-white border border-warm-200 rounded-[10px] px-4 py-3 font-body text-charcoal placeholder:text-warm-400 focus:outline-none focus:border-coral-400 focus:ring-1 focus:ring-coral-400 transition-all"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="bg-coral-400 hover:bg-coral-600 text-white font-body text-sm font-semibold px-6 py-3 rounded-[10px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[160px]"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate script
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Loading Skeletons */}
            {isGenerating && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-xl p-4 md:p-6 border border-warm-200 shadow-sm h-32 animate-pulse"></div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-warm-200 shadow-sm h-48 animate-pulse"></div>
                <div className="bg-white rounded-xl p-4 md:p-6 border border-warm-200 shadow-sm h-32 animate-pulse"></div>
              </div>
            )}

            {/* Script Sections */}
            {!isGenerating && (hasGenerated || hook || bodyContent || cta) && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Hook Section */}
                <section className="bg-white rounded-xl p-4 md:p-6 border border-warm-200 shadow-sm border-l-4 border-l-coral-400 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading text-lg font-bold text-coral-600">Hook</h3>
                    <span className="bg-warm-200 text-warm-600 font-body text-xs font-bold px-2.5 py-1 rounded-md">00:00 - 00:15</span>
                  </div>
                  <AutoResizeTextarea
                    value={hook}
                    onChange={(e) => setHook(e.target.value)}
                    placeholder="Grab their attention in the first 5 seconds..."
                  />
                </section>

                {/* Body Content Section */}
                <section className="bg-white rounded-xl p-4 md:p-6 border border-warm-200 shadow-sm border-l-4 border-l-amber flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading text-lg font-bold text-amber">Body Content</h3>
                    <span className="bg-warm-200 text-warm-600 font-body text-xs font-bold px-2.5 py-1 rounded-md">00:15 - 02:30</span>
                  </div>
                  <AutoResizeTextarea
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                    placeholder="Deliver on your promise. Break down the core value points here..."
                    className="min-h-[100px]"
                  />
                </section>

                {/* CTA Section */}
                <section className="bg-white rounded-xl p-4 md:p-6 border border-warm-200 shadow-sm border-l-4 border-l-warm-400 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-heading text-lg font-bold text-charcoal">Call to Action</h3>
                    <span className="bg-warm-200 text-warm-600 font-body text-xs font-bold px-2.5 py-1 rounded-md">02:30 - 03:00</span>
                  </div>
                  <AutoResizeTextarea
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="What should the viewer do next? Subscribe? Download? Comment?"
                  />
                </section>

                {/* Regenerate Button */}
                <button 
                  onClick={handleGenerate}
                  className="self-start px-5 py-2.5 rounded-[10px] border border-warm-300 text-warm-600 font-body text-sm font-semibold hover:bg-warm-100 transition-colors mt-2"
                >
                  Regenerate content
                </button>

              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Metadata & Assets (40%) */}
          <div className="w-full md:w-[40%] flex flex-col gap-6">
            
            {/* B-Roll Suggestions */}
            <div className="bg-warm-100 rounded-xl p-4 md:p-5 border border-warm-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Film className="w-5 h-5 text-coral-600" />
                <h3 className="font-heading text-lg font-bold text-charcoal">B-Roll Suggestions</h3>
              </div>
              
              <div className="flex flex-col gap-3 mb-5">
                {bRollItems.map((item, idx) => (
                  <div key={idx} className="bg-white pr-2 pl-3 py-2 rounded-lg border border-warm-200 font-body text-sm text-charcoal flex items-center justify-between group focus-within:border-coral-400 focus-within:ring-1 focus-within:ring-coral-400 transition-all shadow-sm">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateBRollMarker(idx, e.target.value)}
                      placeholder="Describe B-roll shot..."
                      className="flex-1 bg-transparent border-none focus:ring-0 outline-none p-1 placeholder:text-warm-300 min-w-0"
                    />
                    <button 
                      onClick={() => removeBRollMarker(idx)}
                      className="text-warm-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {bRollItems.length === 0 && (
                  <div className="text-center py-6 bg-warm-50 rounded-lg border border-dashed border-warm-200">
                    <p className="font-body text-sm text-warm-400">No B-roll markers yet.</p>
                  </div>
                )}
              </div>
              
              <button 
                onClick={addBRollMarker}
                className="w-full border border-dashed border-warm-300 rounded-lg py-3 flex items-center justify-center gap-2 text-charcoal font-body text-sm font-semibold hover:bg-warm-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add B-Roll Marker
              </button>
            </div>

            {/* SEO Optimizer */}
            <div className="bg-white rounded-xl p-5 border border-warm-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Search className="w-5 h-5 text-tertiary-container" />
                <h3 className="font-heading text-lg font-bold text-charcoal">SEO Optimizer</h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block font-heading text-[10px] font-bold text-charcoal uppercase tracking-wider mb-2">Recommended Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-warm-50 border border-warm-200 rounded-lg px-3 py-2.5 font-body text-sm text-charcoal focus:outline-none focus:border-tertiary-container transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block font-heading text-[10px] font-bold text-charcoal uppercase tracking-wider mb-2">Description Snippet</label>
                  <AutoResizeTextarea
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full bg-warm-50 border border-warm-200 rounded-lg px-3 py-2.5 font-body text-sm text-charcoal focus:outline-none focus:border-tertiary-container transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-heading text-[10px] font-bold text-charcoal uppercase tracking-wider mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="bg-coral-50 text-coral-600 px-3 py-1 rounded-md font-body text-[11px] font-bold flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(idx)} className="hover:text-coral-800 rounded-full focus:outline-none">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type and press Enter to add tags..."
                    className="w-full bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 font-body text-sm text-charcoal focus:outline-none focus:border-tertiary-container transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Target Publish Date */}
            <div className="bg-white rounded-xl p-5 border border-warm-200 shadow-sm mb-12 lg:mb-0">
              <label className="block font-heading text-[10px] font-bold text-charcoal uppercase tracking-wider mb-3">Target Publish Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-warm-50 border border-warm-200 rounded-lg pl-3 pr-10 py-2.5 font-body text-sm text-charcoal focus:outline-none focus:border-coral-400 transition-colors"
                />
                <CalendarIcon className="w-4 h-4 text-warm-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

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
