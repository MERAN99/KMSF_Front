import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User', 'Subscription', 'Event', 'Donation'],
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
            query: ({ page = 1, limit = 20, search = '' } = {}) =>
                `/admin/members?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
            providesTags: ['User'],
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
    useVerifySessionMutation,
    useGetAdminStatsQuery,
    useGetAllUsersQuery,
    useAdminGetEventsQuery,
    useAdminCreateEventMutation,
    useAdminUpdateEventMutation,
    useAdminDeleteEventMutation,
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
    useGetProfileQuery,
    useUpdateProfileMutation,
    useRequestEmailChangeMutation,
    useConfirmEmailChangeMutation,
} = apiSlice;
