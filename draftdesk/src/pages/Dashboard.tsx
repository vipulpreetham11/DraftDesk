import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, CheckCircle, ArrowRight, LayoutDashboard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import type { ProjectCardProps, ProjectStatus } from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { insforge } from '../lib/insforge';

const FILTERS = ['All', 'idea', 'scripted', 'recorded', 'edited', 'published'];


const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<any[]>([]); // Using any[] here because ProjectCardProps is mapped later
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const { data, error } = await insforge
          .database.from('projects')
          .select('*, scripts(*)')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setProjects(data);
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setFetchError(err.message || 'Couldn\'t load your content. Try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const formattedProjects: ProjectCardProps[] = projects.map(p => {
    const checklist = p.checklist_state || {};
    const completedSteps = Object.values(checklist).filter(Boolean).length;
    return {
      id: p.id,
      title: p.title,
      description: p.scripts && p.scripts.length > 0 ? 'Script attached' : 'No script added yet',
      status: p.status as ProjectStatus,
      date: new Date(p.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      platform: p.platform,
      completedSteps
    };
  });

  const filteredProjects = formattedProjects.filter(p => filter === 'All' || p.status === filter);

  // Calculate Stats
  const totalProjects = projects.length;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonth = projects.filter(p => {
    const d = new Date(p.created_at || p.updated_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const inProgress = projects.filter(p => ['idea', 'scripted', 'recorded', 'edited'].includes(p.status)).length;
  const published = projects.filter(p => p.status === 'published').length;

  return (
    <div className="flex flex-col min-h-screen bg-warm-50 pb-8">
      
      {/* Sticky Top Header */}
      <header className="sticky top-0 bg-warm-50/90 backdrop-blur-md z-20 px-4 md:px-8 py-4 md:py-6 border-b border-warm-200 md:border-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">Your content</h2>
              <button className="md:hidden text-coral-400 font-body text-sm font-semibold flex items-center gap-1">
                See all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full font-body text-sm font-semibold whitespace-nowrap transition-all capitalize ${
                    filter === f 
                      ? 'bg-coral-400 text-white shadow-sm' 
                      : 'bg-white text-warm-600 border border-warm-200 hover:border-coral-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/new')}
            className="hidden md:flex bg-coral-400 text-white px-6 py-3 rounded-xl font-body text-sm font-semibold shadow-sm hover:bg-coral-600 transition-all items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            New script
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
        
        {/* Stats Row */}
        {fetchError ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-200 mb-8 font-body font-semibold">
            {fetchError}
          </div>
        ) : (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            
            {/* Total Projects */}
            <div className="bg-white p-5 rounded-xl border border-warm-200 shadow-sm flex flex-col justify-between h-[120px]">
              <p className="font-body text-sm font-semibold text-warm-500 mb-2">Total Projects</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-warm-200 animate-pulse rounded"></div>
              ) : (
                <div className="flex items-end justify-between">
                  <h3 className="font-heading text-3xl font-bold text-coral-500">{totalProjects}</h3>
                </div>
              )}
            </div>

            {/* This Month */}
            <div className="bg-white p-5 rounded-xl border border-warm-200 shadow-sm flex flex-col justify-between h-[120px]">
              <p className="font-body text-sm font-semibold text-warm-500 mb-2">This Month</p>
              {isLoading ? (
                <div className="h-8 w-16 bg-warm-200 animate-pulse rounded"></div>
              ) : (
                <div className="flex items-end justify-between">
                  <h3 className="font-heading text-3xl font-bold text-charcoal">{thisMonth}</h3>
                  <CheckCircle className="w-5 h-5 text-green-500 mb-1" />
                </div>
              )}
            </div>

            {/* In Progress */}
            <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-xl border border-warm-200 shadow-sm flex flex-col justify-between h-[120px]">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-body text-sm font-semibold text-warm-500">In Progress</p>
                  {isLoading ? (
                    <div className="h-8 w-16 bg-warm-200 animate-pulse rounded mt-1"></div>
                  ) : (
                    <h3 className="font-heading text-3xl font-bold text-charcoal mt-1">
                      {inProgress}
                    </h3>
                  )}
                </div>
                <LayoutDashboard className="w-8 h-8 text-coral-200" />
              </div>
            </div>

            {/* Published */}
            <div className="col-span-2 lg:col-span-1 bg-coral-50 p-5 rounded-xl border border-coral-200 flex flex-col justify-between h-[120px]">
               <div className="flex justify-between items-start mb-2">
                 <div>
                    <p className="font-body text-sm font-semibold text-coral-600">Published</p>
                    {isLoading ? (
                      <div className="h-8 w-16 bg-coral-200 animate-pulse rounded mt-1"></div>
                    ) : (
                      <h3 className="font-heading text-3xl font-bold text-coral-500 mt-1">{published}</h3>
                    )}
                 </div>
               </div>
            </div>

          </section>
        )}

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center pb-24">
            <Loader2 className="w-8 h-8 text-coral-400 animate-spin" />
          </div>
        ) : filteredProjects.length > 0 ? (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 pb-24 md:pb-8">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </section>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
