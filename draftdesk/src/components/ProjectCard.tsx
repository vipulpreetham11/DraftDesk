import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, FileText, CheckCircle, Smartphone, PlaySquare, TrendingUp } from 'lucide-react';

export type ProjectStatus = 'idea' | 'scripted' | 'recorded' | 'edited' | 'published';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  date: string;
  time?: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'twitter' | 'other';
  completedSteps: number;
  stats?: string;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const getStatusStyles = (status: ProjectStatus) => {
  switch (status) {
    case 'idea':
      return 'bg-warm-200 text-warm-600';
    case 'scripted':
      return 'bg-amber-light text-[#8B6914]';
    case 'recorded':
      return 'bg-[#D4EDFF] text-[#2B6CB0]';
    case 'edited':
      return 'bg-coral-50 text-coral-600';
    case 'published':
      return 'bg-coral-400 text-white';
    default:
      return 'bg-warm-200 text-warm-600';
  }
};

const getPlatformIcon = (platform: ProjectCardProps['platform']) => {
  switch (platform) {
    case 'youtube':
      return <Video className="w-4 h-4" />;
    case 'tiktok':
    case 'instagram':
      return <Smartphone className="w-4 h-4" />;
    case 'linkedin':
    case 'twitter':
      return <FileText className="w-4 h-4" />;
    default:
      return <PlaySquare className="w-4 h-4" />;
  }
};

const getActionText = (status: ProjectStatus) => {
  switch (status) {
    case 'idea': return 'Draft now';
    case 'scripted': return 'Edit script';
    case 'recorded': return 'View clips';
    case 'edited': return 'Final Review';
    case 'published': return 'View stats';
    default: return 'Open';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  status,
  date,
  time,
  platform,
  completedSteps,
  stats
}) => {
  return (
    <Link to={`/content/${id}`} className={`block bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-warm-200 flex flex-col gap-3 group hover:border-coral-200 hover:shadow-md transition-all ${status === 'idea' ? 'border-dashed opacity-80 hover:opacity-100' : ''}`}>
      
      {/* Top row: Badge and Progress Dots */}
      <div className="flex justify-between items-start mb-1">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-body font-bold uppercase tracking-wider ${getStatusStyles(status)}`}>
          {status}
        </span>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i < completedSteps ? 'bg-coral-400' : 'bg-warm-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-heading text-lg font-semibold text-charcoal leading-tight mb-2 group-hover:text-coral-500 transition-colors">
          {title}
        </h3>
        <p className="font-body text-sm text-warm-500 line-clamp-2 italic">
          {description}
        </p>
      </div>

      {/* Bottom row: Metadata and Action */}
      <div className="pt-4 flex items-center justify-between border-t border-warm-100 mt-2">
        <div className="flex gap-4 text-warm-500">
          <div className={`flex items-center gap-1.5 ${status === 'published' ? 'text-coral-500 font-semibold' : ''}`}>
            {status === 'published' ? <CheckCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            <span className="text-[12px] font-body">{date}</span>
          </div>
          
          {time && status !== 'published' && (
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <Clock className="w-4 h-4" />
              <span className="text-[12px] font-body">{time}</span>
            </div>
          )}
          
          {stats && status === 'published' && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[12px] font-body">{stats}</span>
            </div>
          )}

          {!stats && (
            <div className="flex items-center gap-1.5">
              {getPlatformIcon(platform)}
              <span className="text-[12px] font-body">{capitalize(platform)}</span>
            </div>
          )}
        </div>
        
        <button className="text-coral-400 hover:text-coral-600 font-body text-sm font-semibold flex items-center gap-1 active:scale-95 transition-all">
          {getActionText(status)}
        </button>
      </div>
    </Link>
  );
};

export default ProjectCard;
