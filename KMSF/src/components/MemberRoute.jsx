import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectCurrentToken, selectMembershipStatus } from '../store/slices/authSlice';

/**
 * MemberRoute — protects routes based on membership level.
 *
 * @param {string} requiredLevel
 *   'registered' → user must be logged in (any status: registered | active | admin)
 *   'active'     → user must be a paying member (active | admin)
 *
 * Non-members are redirected to /membership with the intended destination stored
 * in location.state so the page can show a contextual message.
 */
const MemberRoute = ({ children, requiredLevel = 'active' }) => {
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectCurrentToken);
    const membershipStatus = useSelector(selectMembershipStatus);
    const location = useLocation();

    const isLoggedIn = !!(user && token);

    const ACTIVE_STATUSES = ['active', 'admin'];
    const REGISTERED_STATUSES = ['registered', 'active', 'admin'];

    const hasAccess = isLoggedIn && (
        requiredLevel === 'registered'
            ? REGISTERED_STATUSES.includes(membershipStatus)
            : ACTIVE_STATUSES.includes(membershipStatus)
    );

    if (!hasAccess) {
        return (
            <Navigate
                to="/membership"
                state={{
                    from: location,
                    reason: !isLoggedIn ? 'login' : 'inactive',
                }}
                replace
            />
        );
    }

    return children;
};

export default MemberRoute;
