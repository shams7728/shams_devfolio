'use client';

/**
 * Test page for 3D Components
 * This page is for development/testing purposes only
 */

import { useState } from 'react';
import FloatingPortrait from '@/components/3d/floating-portrait';
import TechEcosystem, { Technology } from '@/components/3d/tech-ecosystem';

export default function Test3DPage() {
  // Using a placeholder image URL - in production this would come from the database
  const portraitUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&h=800&fit=crop';
  
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null);
  
  // Sample technologies for testing
  const sampleTechnologies: Technology[] = [
    // Frontend
    { id: '1', name: 'React', category: 'Frontend', relatedTech: ['2', '3', '4'] },
    { id: '2', name: 'Next.js', category: 'Frontend', relatedTech: ['1', '3'] },
    { id: '3', name: 'TypeScript', category: 'Language', relatedTech: ['1', '2', '4', '5'] },
    { id: '4', name: 'Tailwind CSS', category: 'Frontend', relatedTech: ['1', '2'] },
    { id: '5', name: 'Three.js', category: 'Frontend', relatedTech: ['1', '3'] },
    
    // Backend
    { id: '6', name: 'Node.js', category: 'Backend', relatedTech: ['3', '7', '8'] },
    { id: '7', name: 'Express', category: 'Backend', relatedTech: ['6', '8'] },
    { id: '8', name: 'PostgreSQL', category: 'Database', relatedTech: ['6', '7', '9'] },
    { id: '9', name: 'Supabase', category: 'Backend', relatedTech: ['8', '1'] },
    
    // Languages
    { id: '10', name: 'JavaScript', category: 'Language', relatedTech: ['1', '2', '6'] },
    { id: '11', name: 'Python', category: 'Language', relatedTech: ['12', '13'] },
    { id: '12', name: 'Django', category: 'Backend', relatedTech: ['11', '8'] },
    { id: '13', name: 'FastAPI', category: 'Backend', relatedTech: ['11', '8'] },
    
    // Mobile
    { id: '14', name: 'Flutter', category: 'Mobile', relatedTech: ['15'] },
    { id: '15', name: 'Dart', category: 'Language', relatedTech: ['14'] },
    { id: '16', name: 'React Native', category: 'Mobile', relatedTech: ['1', '3'] },
    
    // DevOps
    { id: '17', name: 'Docker', category: 'DevOps', relatedTech: ['18', '19'] },
    { id: '18', name: 'Kubernetes', category: 'DevOps', relatedTech: ['17'] },
    { id: '19', name: 'AWS', category: 'Cloud', relatedTech: ['17', '18'] },
    { id: '20', name: 'Vercel', category: 'Cloud', relatedTech: ['2'] },
    
    // Tools
    { id: '21', name: 'Git', category: 'Tools', relatedTech: ['22'] },
    { id: '22', name: 'GitHub', category: 'Tools', relatedTech: ['21'] },
    { id: '23', name: 'VS Code', category: 'Tools', relatedTech: ['3'] },
    
    // Data
    { id: '24', name: 'Pandas', category: 'Data Science', relatedTech: ['11', '25'] },
    { id: '25', name: 'NumPy', category: 'Data Science', relatedTech: ['11', '24'] },
    { id: '26', name: 'Matplotlib', category: 'Data Science', relatedTech: ['11', '24'] },
  ];
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          3D Components Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Test with parallax enabled */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              With Parallax & Reactive Lighting
            </h2>
            <div className="w-full h-[400px]">
              <FloatingPortrait
                imageUrl={portraitUrl}
                enableParallax={true}
                lightingIntensity={1.5}
              />
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Move your mouse over the portrait to see parallax motion and reactive lighting
            </p>
          </div>
          
          {/* Test without parallax */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Without Parallax
            </h2>
            <div className="w-full h-[400px]">
              <FloatingPortrait
                imageUrl={portraitUrl}
                enableParallax={false}
                lightingIntensity={1.0}
              />
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Subtle rotation animation only
            </p>
          </div>
        </div>
        
        {/* Feature checklist */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Floating Portrait Features
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Three.js scene with camera and lighting
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Portrait image loaded as texture on 3D plane
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Subtle rotation animation
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Reactive lighting based on cursor proximity
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Parallax motion following mouse movement
            </li>
            <li className="flex items-center">
              <span className="text-green-400 mr-2">✓</span>
              Fallback to 2D image for unsupported browsers
            </li>
          </ul>
        </div>
        
        {/* Tech Ecosystem Test */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Tech Ecosystem Map Test
          </h1>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Interactive 3D Tech Stack Visualization
            </h2>
            <div className="w-full h-[600px]">
              <TechEcosystem
                technologies={sampleTechnologies}
                onTechHover={setHoveredTech}
              />
            </div>
            {hoveredTech && (
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {hoveredTech.name}
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  Category: {hoveredTech.category}
                </p>
                <p className="text-gray-300 text-sm">
                  Related Technologies: {hoveredTech.relatedTech.length} connections
                </p>
              </div>
            )}
            <p className="text-gray-400 text-sm mt-4">
              Hover over technology nodes to see connections and details. The camera will smoothly focus on the selected technology.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Tech Ecosystem Features
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                3D circular visualization using Three.js
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Technology node positioning algorithm
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Category-based grouping with visual connections
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Hover effects showing related technologies
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Smooth camera transitions when hovering
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Optimized for 50+ technology nodes ({sampleTechnologies.length} nodes loaded)
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                Fallback to 2D grid for unsupported browsers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
