import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  membershipStatus: localStorage.getItem('membershipStatus') || 'inactive',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.membershipStatus = user?.membershipStatus || 'inactive';

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('membershipStatus', state.membershipStatus);
    },
    updateMembershipStatus: (state, action) => {
      state.membershipStatus = action.payload;
      localStorage.setItem('membershipStatus', action.payload);
      if (state.user) {
        state.user.membershipStatus = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.membershipStatus = 'inactive';
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('membershipStatus');
    },
  },
});

export const { setCredentials, updateMembershipStatus, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectMembershipStatus = (state) => state.auth.membershipStatus;
