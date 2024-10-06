import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Init state
const initialState = {
    exam: null,
    loading: false,
    error: null
};

// async thunk to call api
export const fetchExam = createAsyncThunk(
    'exam/fetchExam',
    async (examId, thunkAPI) => {
        try {
            const response = await fetch('/instructor/exam.json');
            const data = await response.json();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        updateExam: (state, action) => {
            return { ...state, exam: { ...state.exam, ...action.payload } };
        },
        updateQuestion: (state, action) => {
            const { questionId, updatedQuestion } = action.payload;
            const index = state.exam.questions.findIndex(q => q._id === questionId);
            if (index !== -1) {
                state.exam.questions[index] = updatedQuestion;
            }
        },
        addQuestion: (state, action) => {
            state.exam.questions.push(action.payload);
        },
        removeQuestion: (state, action) => {
            const questionId = action.payload;
            state.exam.questions = state.exam.questions.filter(q => q._id !== questionId);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExam.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExam.fulfilled, (state, action) => {
                state.loading = false;
                state.exam = action.payload;
            })
            .addCase(fetchExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// export action
export const { updateExam, updateQuestion, addQuestion, removeQuestion } = examSlice.actions;

// export reducte to store
export default examSlice.reducer;
