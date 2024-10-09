// questionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    questions: [
        { id: 1, text: 'AOTY is:', answers: [{ id: 1, text: 'Saitama' }, { id: 2, text: 'One Piece' }, { id: 3, text: 'Dragon Ball' }, { id: 4, text: 'Doraemon' }], correctAnswer: null },
    ],
    editMode: null, // Lưu trữ câu hỏi đang chỉnh sửa
};

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        addQuestion: (state, action) => {
            state.questions.push(action.payload);
        },
        updateQuestion: (state, action) => {
            const index = state.questions.findIndex((q) => q.id === action.payload.id);
            if (index !== -1) {
                state.questions[index] = action.payload;
            }
        },
        removeQuestion: (state, action) => {
            state.questions = state.questions.filter((q) => q.id !== action.payload);
        },
        setEditMode: (state, action) => {
            state.editMode = action.payload;
        },
    },
});

export const { addQuestion, updateQuestion, removeQuestion, setEditMode } = questionSlice.actions;

export default questionSlice.reducer;
