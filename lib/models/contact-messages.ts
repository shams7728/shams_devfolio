/**
 * Contact Messages Model
 * 
 * Business logic layer for Contact Message operations
 * Requirements: 11.4
 */

import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContactMessage, CreateContactMessageData, UpdateContactMessageData } from '@/lib/types/database';

/**
 * Validation schema for creating a contact message
 */
export const createContactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  email: z.string().email('Invalid email address').max(255, 'Email must be 255 characters or less'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be 2000 characters or less'),
});

/**
 * Validation schema for updating a contact message
 */
export const updateContactMessageSchema = z.object({
  status: z.enum(['new', 'read', 'archived']),
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>;
export type UpdateContactMessageInput = z.infer<typeof updateContactMessageSchema>;

/**
 * Contact Messages Model Class
 * 
 * Provides CRUD operations and business logic for contact messages
 */
export class ContactMessagesModel {
  /**
   * Fetch all contact messages, optionally filtered by status
   * Ordered by created_at descending (newest first)
   * 
   * Requirements: 11.5
   */
  static async getAll(
    client: SupabaseClient,
    status?: 'new' | 'read' | 'archived'
  ): Promise<ContactMessage[]> {
    let query = client
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch contact messages: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Fetch a single contact message by ID
   */
  static async getById(
    client: SupabaseClient,
    id: string
  ): Promise<ContactMessage | null> {
    const { data, error } = await client
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch contact message: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new contact message
   * 
   * Validates email format and sanitizes input
   * Requirements: 11.4
   */
  static async create(
    client: SupabaseClient,
    input: CreateContactMessageInput
  ): Promise<ContactMessage> {
    // Validate input
    const validated = createContactMessageSchema.parse(input);

    // Sanitize input (trim whitespace)
    const sanitized: CreateContactMessageData = {
      name: validated.name.trim(),
      email: validated.email.trim().toLowerCase(),
      message: validated.message.trim(),
    };

    // Insert into database with 'new' status
    const { data, error } = await client
      .from('contact_messages')
      .insert({
        ...sanitized,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create contact message: ${error.message}`);
    }

    return data;
  }

  /**
   * Update contact message status
   * 
   * Requirements: 11.5
   */
  static async updateStatus(
    client: SupabaseClient,
    id: string,
    input: UpdateContactMessageInput
  ): Promise<ContactMessage> {
    // Validate input
    const validated = updateContactMessageSchema.parse(input);

    // Check if message exists
    const existing = await this.getById(client, id);
    if (!existing) {
      throw new Error('Contact message not found');
    }

    // Update status
    const { data, error } = await client
      .from('contact_messages')
      .update({ status: validated.status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update contact message: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a contact message
   * 
   * Requirements: 11.5
   */
  static async delete(
    client: SupabaseClient,
    id: string
  ): Promise<void> {
    // Check if message exists
    const existing = await this.getById(client, id);
    if (!existing) {
      throw new Error('Contact message not found');
    }

    // Delete message
    const { error } = await client
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete contact message: ${error.message}`);
    }
  }
}
