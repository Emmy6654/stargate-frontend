'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

/**
 * Hook for fetching a list of team members with optional filtering.
 *
 * Automatically refreshes team member data every 30 seconds.
 * Useful for displaying team members in lists or tables with real-time updates.
 *
 * @param {string} [query=''] - Optional search/filter query string
 * @returns {Object} SWR response object with team members data, loading, and error states
 *
 * @example
 * const { data: members, isLoading } = useTeamMembers('role:admin');
 * return <TeamMemberList members={members} />;
 */
export function useTeamMembers(query = '') {
  return useSWR(['team', query], () => api.team.list(query), { refreshInterval: 30_000 });
}

/**
 * Hook for fetching a single team member by ID.
 *
 * Fetches detailed information about a specific team member.
 * Useful for displaying team member profile or detail pages.
 *
 * @param {string} id - The team member ID to fetch
 * @returns {Object} SWR response object with team member data, loading, and error states
 *
 * @example
 * const { data: member } = useTeamMember('member-123');
 * return <TeamMemberProfile member={member} />;
 */
export function useTeamMember(id: string) {
  return useSWR(['team-member', id], () => api.team.get(id));
}
