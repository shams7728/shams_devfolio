'use client';

/**
 * Draggable Timeline List Component
 * 
 * Drag-and-drop interface for reordering timeline milestones
 * Requirements: 9.4
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
import type { TimelineMilestone } from '@/lib/types/database';

interface DraggableTimelineListProps {
  milestones: TimelineMilestone[];
  onReorder: (milestones: TimelineMilestone[]) => Promise<void>;
  onEdit: (milestone: TimelineMilestone) => void;
  onDelete: (milestone: TimelineMilestone) => void;
}

interface SortableTimelineItemProps {
  milestone: TimelineMilestone;
  onEdit: (milestone: TimelineMilestone) => void;
  onDelete: (milestone: TimelineMilestone) => void;
}

function SortableTimelineItem({ milestone, onEdit, onDelete }: SortableTimelineItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: milestone.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="backdrop-blur-xl bg-white/70 dark:bg-zinc-900/70 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50 shadow-lg p-4 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Year Badge */}
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
          <div className="text-center">
            <div className="text-xs opacity-80">Year</div>
            <div className="text-lg">{milestone.year}</div>
          </div>
        </div>

        {/* Milestone Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">
            {milestone.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {milestone.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Edit */}
          <button
            onClick={() => onEdit(milestone)}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            title="Edit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(milestone)}
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

export function DraggableTimelineList({
  milestones,
  onReorder,
  onEdit,
  onDelete,
}: DraggableTimelineListProps) {
  const [items, setItems] = useState(milestones);
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
        console.error('Failed to reorder timeline milestones:', error);
      } finally {
        setIsReordering(false);
      }
    }
  };

  // Update items when milestones prop changes
  if (milestones !== items && !isReordering) {
    setItems(milestones);
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
        <SortableContext items={items.map(m => m.id)} strategy={verticalListSortingStrategy}>
          {items.map((milestone) => (
            <SortableTimelineItem
              key={milestone.id}
              milestone={milestone}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
