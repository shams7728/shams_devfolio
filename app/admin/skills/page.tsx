'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/lib/contexts/toast-context';
import type { SkillCategory, Skill } from '@/lib/types/database';

export default function AdminSkillsPage() {
    const { success, error: showError } = useToast();
    const [categories, setCategories] = useState<SkillCategory[]>([]);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isLoadingCats, setIsLoadingCats] = useState(true);
    const [isLoadingSkills, setIsLoadingSkills] = useState(false);

    // Forms state
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isAddingSkill, setIsAddingSkill] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSkillName, setNewSkillName] = useState('');

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/skills/categories');
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(data);
            if (data.length > 0 && !selectedCategoryId) {
                setSelectedCategoryId(data[0].id);
            }
        } catch (err) {
            showError('Failed to load categories');
        } finally {
            setIsLoadingCats(false);
        }
    };

    // Fetch Skills for Category
    const fetchSkills = async (categoryId: string) => {
        setIsLoadingSkills(true);
        try {
            const res = await fetch(`/api/skills?category_id=${categoryId}`);
            if (!res.ok) throw new Error('Failed to fetch skills');
            const data = await res.json();
            setSkills(data);
        } catch (err) {
            showError('Failed to load skills');
        } finally {
            setIsLoadingSkills(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategoryId) {
            fetchSkills(selectedCategoryId);
        } else {
            setSkills([]);
        }
    }, [selectedCategoryId]);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            const res = await fetch('/api/skills/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newCategoryName,
                    slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                }),
            });

            if (!res.ok) throw new Error('Failed to create category');

            await fetchCategories();
            setNewCategoryName('');
            setIsAddingCategory(false);
            success('Category created');
        } catch (err) {
            showError('Failed to create category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure? This will delete all skills in this category.')) return;
        try {
            const res = await fetch(`/api/skills/categories/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            await fetchCategories();
            if (selectedCategoryId === id) setSelectedCategoryId(null);
            success('Category deleted');
        } catch (err) {
            showError('Failed to delete category');
        }
    };

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSkillName.trim() || !selectedCategoryId) return;

        try {
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newSkillName,
                    category_id: selectedCategoryId,
                }),
            });

            if (!res.ok) throw new Error('Failed to create skill');

            await fetchSkills(selectedCategoryId);
            setNewSkillName('');
            setIsAddingSkill(false);
            success('Skill added');
        } catch (err) {
            showError('Failed to add skill');
        }
    };

    const handleDeleteSkill = async (id: string) => {
        if (!confirm('Delete this skill?')) return;
        try {
            const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            if (selectedCategoryId) await fetchSkills(selectedCategoryId);
            success('Skill deleted');
        } catch (err) {
            showError('Failed to delete skill');
        }
    };

    return (
        <div className="space-y-6 pb-20 lg:pb-8 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                        Skills Management
                    </h1>
                    <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                        Manage your technical skills and categories
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Categories Column */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Categories</h2>
                        <button
                            onClick={() => setIsAddingCategory(true)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Add Category"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    {isAddingCategory && (
                        <form onSubmit={handleAddCategory} className="p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Category Name"
                                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">Save</button>
                                <button type="button" onClick={() => setIsAddingCategory(false)} className="flex-1 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-sm font-medium">Cancel</button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-2">
                        {isLoadingCats ? (
                            <div className="text-center py-4 text-zinc-500">Loading...</div>
                        ) : categories.map(category => (
                            <div
                                key={category.id}
                                onClick={() => setSelectedCategoryId(category.id)}
                                className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${selectedCategoryId === category.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 shadow-md'
                                        : 'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700'
                                    }`}
                            >
                                <span className={`font-medium ${selectedCategoryId === category.id ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                    {category.title}
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills Column */}
                <div className="lg:col-span-2 space-y-4">
                    {selectedCategoryId ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
                                    Skills in <span className="text-blue-500">{categories.find(c => c.id === selectedCategoryId)?.title}</span>
                                </h2>
                                <button
                                    onClick={() => setIsAddingSkill(true)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Skill
                                </button>
                            </div>

                            {isAddingSkill && (
                                <form onSubmit={handleAddSkill} className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 mb-6">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={newSkillName}
                                            onChange={(e) => setNewSkillName(e.target.value)}
                                            placeholder="Skill Name (e.g. React, Python)"
                                            className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            autoFocus
                                        />
                                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">Add</button>
                                        <button type="button" onClick={() => setIsAddingSkill(false)} className="px-6 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg font-medium">Cancel</button>
                                    </div>
                                </form>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {isLoadingSkills ? (
                                    <div className="col-span-full text-center py-10 text-zinc-500">Loading skills...</div>
                                ) : skills.length === 0 ? (
                                    <div className="col-span-full text-center py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-500">
                                        No skills in this category yet.
                                    </div>
                                ) : (
                                    skills.map(skill => (
                                        <div key={skill.id} className="group relative p-4 bg-white dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-zinc-800 dark:text-zinc-200">{skill.name}</span>
                                                <button
                                                    onClick={() => handleDeleteSkill(skill.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl min-h-[300px]">
                            Select a category to manage skills
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
