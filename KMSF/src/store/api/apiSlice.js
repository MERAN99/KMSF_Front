import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config';
import { logout } from '../slices/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Wraps the base query: if the server returns 401 (token expired / invalid),
// automatically log the user out so they are redirected to login.
const baseQueryWithReauth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        api.dispatch(logout());
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Subscription', 'Event', 'Donation', 'Team'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        requestVerification: builder.mutation({
            query: (email) => ({
                url: '/request-verification',
                method: 'POST',
                body: { email },
            }),
        }),
        confirmVerification: builder.mutation({
            query: (data) => ({
                url: '/confirm-verification',
                method: 'POST',
                body: { ...data },
            }),
        }),
        register: builder.mutation({
            query: (profileData) => ({
                url: '/register',
                method: 'POST',
                body: { ...profileData },
            }),
        }),
        startSubscription: builder.mutation({
            query: () => ({
                url: '/start-subscription',
                method: 'POST',
            }),
        }),
        getSubscriptionStatus: builder.query({
            query: () => '/member/subscription-status',
            providesTags: ['Subscription'],
        }),
        renewSubscription: builder.mutation({
            query: () => ({
                url: '/renew-subscription',
                method: 'POST',
            }),
            invalidatesTags: ['Subscription'],
        }),
        cancelSubscription: builder.mutation({
            query: () => ({
                url: '/cancel-subscription',
                method: 'POST',
            }),
            invalidatesTags: ['Subscription', 'User'],
        }),
        verifySession: builder.mutation({
            query: (sessionId) => ({
                url: '/verify-session',
                method: 'POST',
                body: { sessionId },
            }),
        }),
        // Admin Endpoints
        getAdminStats: builder.query({
            query: () => '/admin/stats',
            providesTags: ['User', 'Subscription'],
        }),
        getAllUsers: builder.query({
            query: ({ page = 1, limit = 20, search = '', status = '', organization = '' } = {}) => {
                let url = `/admin/members?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                if (status) url += `&status=${status}`;
                if (organization) url += `&organization=${organization}`;
                return url;
            },
            providesTags: ['User'],
        }),
        sendBulkReminderEmail: builder.mutation({
            query: (data) => ({
                url: '/admin/member/bulk-email',
                method: 'POST',
                body: data,
            }),
        }),
        adminGetEvents: builder.query({
            query: () => '/admin/events',
            providesTags: ['Event'],
        }),
        adminCreateEvent: builder.mutation({
            query: (formData) => ({
                url: '/admin/event',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Event'],
        }),
        adminUpdateEvent: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/admin/event/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Event'],
        }),
        adminDeleteEvent: builder.mutation({
            query: (id) => ({
                url: `/admin/event/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Event'],
        }),
        // User Admin Endpoints
        getMember: builder.query({
            query: (id) => `/admin/member/${id}`,
            providesTags: ['User'],
        }),
        adminUpdateMember: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/admin/member/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ['User', 'Stats'],
        }),
        toggleBlockUser: builder.mutation({
            query: (id) => ({
                url: `/admin/member/${id}/toggle-block`,
                method: 'PATCH',
            }),
            invalidatesTags: ['User'],
        }),
        deleteMember: builder.mutation({
            query: (id) => ({
                url: `/admin/member/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        notifyEvent: builder.mutation({
            query: (id) => ({
                url: `/admin/event/${id}/notify`,
                method: 'POST',
            }),
        }),
        // Public Events
        getEvents: builder.query({
            query: () => '/events',
            providesTags: ['Event'],
        }),
        createDonationSession: builder.mutation({
            query: (data) => ({
                url: '/donations/create-session',
                method: 'POST',
                body: data,
            }),
        }),
        confirmDonationSession: builder.mutation({
            query: (sessionId) => ({
                url: '/donations/confirm',
                method: 'POST',
                body: { sessionId },
            }),
            invalidatesTags: ['Donation'],
        }),
        getAdminDonations: builder.query({
            query: () => '/donations/admin',
            providesTags: ['Donation'],
        }),
        getDonationMessages: builder.query({
            query: () => '/donations/messages',
            providesTags: ['Donation'],
        }),
        toggleDonationMessage: builder.mutation({
            query: (id) => ({
                url: `/donations/${id}/toggle-message`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Donation'],
        }),
        submitContactForm: builder.mutation({
            query: (formData) => ({
                url: '/contact',
                method: 'POST',
                body: formData,
            }),
        }),
        changePassword: builder.mutation({
            query: (passwords) => ({
                url: '/change-password',
                method: 'PATCH',
                body: passwords,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: '/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        verifyResetCode: builder.mutation({
            query: (data) => ({
                url: '/verify-reset-code',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (data) => ({
                url: '/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
        getProfile: builder.query({
            query: () => '/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: '/update-profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        requestEmailChange: builder.mutation({
            query: (data) => ({
                url: '/request-email-change',
                method: 'POST',
                body: data,
            }),
        }),
        confirmEmailChange: builder.mutation({
            query: (data) => ({
                url: '/confirm-email-change',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        getTeamMembers: builder.query({
            query: () => '/team-members',
            providesTags: ['Team'],
        }),
        createTeamMember: builder.mutation({
            query: (formData) => ({
                url: '/admin/team-member',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Team'],
        }),
        deleteTeamMember: builder.mutation({
            query: (id) => ({
                url: `/admin/team-member/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Team'],
        }),
        updateTeamMember: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/admin/team-member/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Team'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useRequestVerificationMutation,
    useConfirmVerificationMutation,
    useStartSubscriptionMutation,
    useGetSubscriptionStatusQuery,
    useRenewSubscriptionMutation,
    useCancelSubscriptionMutation,
    useVerifySessionMutation,
    useGetAdminStatsQuery,
    useGetAllUsersQuery,
    useSendBulkReminderEmailMutation,
    useAdminGetEventsQuery,
    useAdminCreateEventMutation,
    useAdminUpdateEventMutation,
    useAdminDeleteEventMutation,
    useGetMemberQuery,
    useAdminUpdateMemberMutation,
    useToggleBlockUserMutation,
    useDeleteMemberMutation,
    useNotifyEventMutation,
    useGetEventsQuery,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useVerifyResetCodeMutation,
    useResetPasswordMutation,
    useCreateDonationSessionMutation,
    useConfirmDonationSessionMutation,
    useGetAdminDonationsQuery,
    useGetDonationMessagesQuery,
    useToggleDonationMessageMutation,
    useSubmitContactFormMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useRequestEmailChangeMutation,
    useConfirmEmailChangeMutation,
    useGetTeamMembersQuery,
    useCreateTeamMemberMutation,
    useDeleteTeamMemberMutation,
    useUpdateTeamMemberMutation,
} = apiSlice;
