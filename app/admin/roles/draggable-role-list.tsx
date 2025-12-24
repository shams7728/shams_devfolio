'use client';

/**
 * Draggable Role List Component
 * 
 * Drag-and-drop interface for reordering roles
 * Requirements: 1.3, 4.4
 */

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Role } from '@/lib/types/database';

interface DraggableRoleListProps {
  roles: Role[];
  onReorder: (roles: Role[]) => Promise<void>;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onTogglePublish: (role: Role) => Promise<void>;
  onConfigureBackground: (role: Role) => void;
}

interface SortableRoleItemProps {
  role: Role;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onTogglePublish: (role: Role) => Promise<void>;
  onConfigureBackground: (role: Role) => void;
}

function SortableRoleItem({ role, onEdit, onDelete, onTogglePublish, onConfigureBackground }: SortableRoleItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: role.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  const handleTogglePublish = async () => {
    setIsTogglingPublish(true);
    try {
      await onTogglePublish(role);
    } finally {
      setIsTogglingPublish(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-4 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Role Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white truncate">
              {role.title}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                role.is_published
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {role.is_published ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {role.description}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
            Slug: {role.slug}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle Publish */}
          <button
            onClick={handleTogglePublish}
            disabled={isTogglingPublish}
            className={`p-2 rounded-lg transition-colors ${
              role.is_published
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={role.is_published ? 'Unpublish' : 'Publish'}
          >
            {role.is_published ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>

          {/* Configure Background */}
          <button
            onClick={() => onConfigureBackground(role)}
            className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            title="Configure Background"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(role)}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(role)}
            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function DraggableRoleList({
  roles,
  onReorder,
  onEdit,
  onDelete,
  onTogglePublish,
  onConfigureBackground,
}: DraggableRoleListProps) {
  const [items, setItems] = useState(roles);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Update display_order for all items
      const reorderedItems = newItems.map((item, index) => ({
        ...item,
        display_order: index,
      }));

      setItems(reorderedItems);
      setIsReordering(true);

      try {
        await onReorder(reorderedItems);
      } catch (error) {
        // Revert on error
        setItems(items);
        console.error('Failed to reorder roles:', error);
      } finally {
        setIsReordering(false);
      }
    }
  };

  // Update items when roles prop changes
  if (roles !== items && !isReordering) {
    setItems(roles);
  }

  return (
    <div className="space-y-3">
      {isReordering && (
        <div className="backdrop-blur-xl bg-blue-50/70 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 p-3">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm font-medium">Saving new order...</span>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(r => r.id)} strategy={verticalListSortingStrategy}>
          {items.map((role) => (
            <SortableRoleItem
              key={role.id}
              role={role}
              onEdit={onEdit}
              onDelete={onDelete}
              onTogglePublish={onTogglePublish}
              onConfigureBackground={onConfigureBackground}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
