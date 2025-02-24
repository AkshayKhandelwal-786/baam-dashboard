import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import errorHandler from '../../helpers/errorHandler';
import constantsService from './constantsService'

const initialState = {
    FORMATS: [],
    COMPETITION_STATUSES: [],
    MATCH_STATUSES: [],
    INNING_STATUSES: [],
    INNING_RESULTS: [],
    ROUND_TYPES: [],
    GENDERS: [],
    ROLES: [],
    OUT_TYPES: [],
    COVERAGE: [],
    message: 'Something went wrong'
}

// get list of countries
export const get = createAsyncThunk('/constants', async (data, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await constantsService.get(token, data);
    } catch (error) {
        if (error.response.data.errors.length > 0) {
            errorHandler(error.response.data.errors);
        }
        if (error.response.data.error) {
            errorHandler(error.response.data.error, 1);
        }
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const constantsSlice = createSlice({
    name: 'constants',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(get.pending, (state) => {
                state.data = []
            })
            .addCase(get.fulfilled, (state, action) => {
                if (action.meta.arg == 'FORMATS') {
                    state.FORMATS = action.payload;
                } else if (action.meta.arg == 'COMPETITION_STATUSES') {
                    state.COMPETITION_STATUSES = action.payload;
                } else if (action.meta.arg == 'MATCH_STATUSES') {
                    state.MATCH_STATUSES = action.payload;
                } else if (action.meta.arg == 'INNING_STATUSES') {
                    state.INNING_STATUSES = action.payload;
                } else if (action.meta.arg == 'INNING_RESULTS') {
                    state.INNING_RESULTS = action.payload;
                } else if (action.meta.arg == 'ROUND_TYPES') {
                    state.ROUND_TYPES = action.payload;
                } else if (action.meta.arg == 'GENDERS') {
                    state.GENDERS = action.payload;
                } else if (action.meta.arg == 'ROLES') {
                    state.ROLES = action.payload;
                } else if (action.meta.arg == 'OUT_TYPES') {
                    state.OUT_TYPES = action.payload;
                } else if (action.meta.arg == 'COVERAGE') {
                    state.COVERAGE = action.payload;
                } else { }
            })
            .addCase(get.rejected, (state, action) => {
                state.data = []
            })
    },
})

export const { reset } = constantsSlice.actions
export default constantsSlice.reducer
