import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initialize state with default fields to avoid errors when creating a new exam
const initialState = {
    exam: {
        _id: null, // Placeholder for exam ID
        title: '', // Placeholder for exam title
        description: '', // Placeholder for exam description
        questions: [], // Empty array to hold questions
        duration: 60,
        access_link: 'http://test',
        access_type: 'public',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
    },
    loading: false,
    error: null
};

// Async thunk to call API (instructor/exam.json is just a mockup)
export const fetchExam = createAsyncThunk(
    'exam/fetchExam',
    async (examId, thunkAPI) => {
        try {
            const response = await fetch(`http://localhost:5000/api/test/${examId}`);
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const createExam = createAsyncThunk(
    'exam/createExam',
    async (examData, thunkAPI) => {
        console.log("Fetching started...");
        console.log("Original Exam Data: ", examData);
        try {
            // Create a copy of examData to avoid directly mutating the original object
            const modifiedExamData = JSON.parse(JSON.stringify(examData));

            // Remove the exam id
            delete modifiedExamData._id;
            console.log("Questions before map:", modifiedExamData);
            // Remove id from each question
            modifiedExamData.exam.questions = Array.isArray(modifiedExamData.exam.questions) 
            ? modifiedExamData.exam.questions.map(question => {
                const { id, ...rest } = question; // Destructure to remove id
                return rest; // Return the question object without the id field
            })
            : [];

            console.log("Modified Exam Data: ", modifiedExamData);
            console.log("Original Exam Data: ", examData);

            const response = await fetch('http://localhost:5000/api/test/create_with_ques', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(modifiedExamData),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error creating exam:", error);
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        // Update entire exam
        updateExam: (state, action) => {
            return { ...state, exam: { ...state.exam, ...action.payload } };
        },
        // Update a specific question
        updateQuestion: (state, action) => {
            const { questionId, updatedQuestion } = action.payload;
            const index = state.exam.questions.findIndex(q => q.id === questionId);
            if (index !== -1) {
                state.exam.questions[index] = updatedQuestion;
            }
        },
        // Add a new question
        addQuestion: (state, action) => {
            state.exam.questions.push(action.payload);
        },
        // Remove a question by its ID
        removeQuestion: (state, action) => {
            const questionId = action.payload;
            state.exam.questions = state.exam.questions.filter(q => q.id !== questionId);
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

// Export actions
export const { updateExam, updateQuestion, addQuestion, removeQuestion } = examSlice.actions;

// Export reducer to store
export default examSlice.reducer;
