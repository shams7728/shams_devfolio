'use client';

/**
 * Tech Ecosystem Section Component
 * 
 * A section component that displays the tech ecosystem map
 * with data fetched from projects
 * 
 * Requirements: 4.1, 4.2, 4.3
 */

import { useState, useEffect } from 'react';
import TechEcosystem, { Technology } from '@/components/3d/tech-ecosystem';
import { buildTechGraph, getTechStats } from '@/lib/utils/tech-graph';
import type { Project } from '@/lib/types/database';

interface TechEcosystemSectionProps {
  projects: Project[];
  className?: string;
}

export default function TechEcosystemSection({
  projects,
  className = '',
}: TechEcosystemSectionProps) {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null);
  const [stats, setStats] = useState<ReturnType<typeof getTechStats> | null>(null);
  
  useEffect(() => {
    // Build technology graph from projects
    const techGraph = buildTechGraph(projects);
    setTechnologies(techGraph);
    
    // Calculate statistics
    const techStats = getTechStats(techGraph);
    setStats(techStats);
  }, [projects]);
  
  if (technologies.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-400">No technologies to display</p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalTechs}</div>
            <div className="text-sm text-gray-400">Technologies</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalCategories}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.totalConnections}</div>
            <div className="text-sm text-gray-400">Connections</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {stats.avgConnectionsPerTech.toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Avg Connections</div>
          </div>
        </div>
      )}
      
      {/* 3D Visualization */}
      <div className="bg-gray-800/30 rounded-lg overflow-hidden">
        <div className="w-full h-[600px]">
          <TechEcosystem
            technologies={technologies}
            onTechHover={setHoveredTech}
          />
        </div>
      </div>
      
      {/* Hovered Tech Info */}
      {hoveredTech && (
        <div className="mt-6 bg-gray-800/50 rounded-lg p-6 animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {hoveredTech.name}
              </h3>
              <p className="text-gray-400 mb-4">
                Category: <span className="text-white">{hoveredTech.category}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400">
                {hoveredTech.relatedTech.length}
              </div>
              <div className="text-sm text-gray-400">Connections</div>
            </div>
          </div>
          
          {hoveredTech.relatedTech.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-2">
                Related Technologies:
              </h4>
              <div className="flex flex-wrap gap-2">
                {hoveredTech.relatedTech.map(relatedId => {
                  const relatedTech = technologies.find(t => t.id === relatedId);
                  return relatedTech ? (
                    <span
                      key={relatedId}
                      className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm"
                    >
                      {relatedTech.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Hover over technology nodes to see connections and details</p>
        <p className="mt-1">The camera will smoothly focus on the selected technology</p>
      </div>
    </div>
  );
}
