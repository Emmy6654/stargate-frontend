'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

/**
 * Hook for fetching a list of disputes with optional filtering.
 *
 * Automatically refreshes dispute data every 30 seconds to keep the list current.
 * Useful for displaying disputes in tables or lists with real-time updates.
 *
 * @param {string} [query=''] - Optional search/filter query string
 * @returns {Object} SWR response object with disputes data, loading, and error states
 *
 * @example
 * const { data: disputes, isLoading, error } = useDisputes('status:open');
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return <DisputeList disputes={disputes} />;
 */
export function useDisputes(query = '') {
  return useSWR(['disputes', query], () => api.disputes.list(query), { refreshInterval: 30_000 });
}

/**
 * Hook for fetching a single dispute by ID.
 *
 * Automatically refreshes dispute data every 10 seconds to keep details current.
 * Useful for displaying detailed dispute information on a detail page.
 *
 * @param {string} id - The dispute ID to fetch
 * @returns {Object} SWR response object with dispute data, loading, and error states
 *
 * @example
 * const { data: dispute, isLoading } = useDispute('dispute-123');
 * return <DisputeDetail dispute={dispute} />;
 */
export function useDispute(id: string) {
  return useSWR(['dispute', id], () => api.disputes.get(id), { refreshInterval: 10_000 });
}

/**
 * Hook for fetching the timeline/history of a dispute.
 *
 * Automatically refreshes timeline data every 10 seconds to show latest updates.
 * Useful for displaying dispute status changes and interactions chronologically.
 *
 * @param {string} id - The dispute ID whose timeline to fetch
 * @returns {Object} SWR response object with timeline data, loading, and error states
 *
 * @example
 * const { data: timeline } = useDisputeTimeline('dispute-123');
 * return <DisputeTimeline events={timeline} />;
 */
export function useDisputeTimeline(id: string) {
  return useSWR(['dispute-timeline', id], () => api.disputes.timeline(id), { refreshInterval: 10_000 });
}
