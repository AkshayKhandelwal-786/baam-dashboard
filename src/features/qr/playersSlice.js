import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import errorHandler from '../../helpers/errorHandler';
import playersService from './playersService'

const initialState = {
    data: [],
    meta: {
        total: 0,
        per_page: 5,
        current_page: 0,
        last_page: 0,
        first_page: 0,
        first_page_url: "/?page=1",
        last_page_url: "/?page=1",
        next_page_url: null,
        previous_page_url: null
    },
    message: 'Something went wrong'
}

// get list of players
export const getAll = createAsyncThunk('/players', async (data, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await playersService.getAll(token, data);
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

// create players
export const create = createAsyncThunk('/players/create', async (data, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await playersService.create(token, data);
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

// update players
export const update = createAsyncThunk('/players/update', async (data, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await playersService.update(token, data);
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

// delete players
export const deleteRow = createAsyncThunk('/players/delete', async (id, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('accessToken'));
        return await playersService.deleteRow(token, id)
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

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAll.pending, (state) => {
                state.data = []
                state.meta = {
                    total: 0,
                    per_page: 5,
                    current_page: 0,
                    last_page: 0,
                    first_page: 0,
                    first_page_url: "/?page=1",
                    last_page_url: "/?page=1",
                    next_page_url: null,
                    previous_page_url: null
                }
            })
            .addCase(getAll.fulfilled, (state, action) => {
                if (action && action.meta && action.meta.arg && action.meta.arg.hasOwnProperty('paginate') && action.meta.arg.paginate == 'no') {
                    state.meta = [];
                    state.data = action.payload
                } else {
                    state.meta = action.payload.meta
                    state.data = action.payload.data
                }
            })
            .addCase(getAll.rejected, (state, action) => {
                state.data = []
                state.meta = {
                    total: 0,
                    per_page: 5,
                    current_page: 0,
                    last_page: 0,
                    first_page: 0,
                    first_page_url: "/?page=1",
                    last_page_url: "/?page=1",
                    next_page_url: null,
                    previous_page_url: null
                }
            })
            .addCase(update.fulfilled, (state, action) => {
                state.message = action.payload.message ? action.payload.message : action.payload.error;
            })
            .addCase(update.rejected, (state, action) => {
                state.message = 'Something went wrong';
            })
            .addCase(deleteRow.pending, (state) => {
                state.message = 'Something went wrong';
            })
            .addCase(deleteRow.fulfilled, (state, action) => {
                state.message = action.payload.message ? action.payload.message : action.payload.error;
                if (action.payload.message) {
                    state.data = state.data.filter(
                        (row) => row.id !== action.meta.arg
                    )
                }
            })
            .addCase(deleteRow.rejected, (state, action) => {
                state.message = 'Something went wrong';
            })

    },
})

export const { reset } = playersSlice.actions
export default playersSlice.reducer
