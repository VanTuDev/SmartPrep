import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initialize state with default fields to avoid errors when creating a new exam
const initialState = {
    exam: {
        _id: null, // Placeholder for exam ID
        title: '', // Placeholder for exam title
        description: '', // Placeholder for exam description
        questions: [], // Empty array to hold questions
        duration: 60,
        access_link: '',
        access_type: 'public',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        status: 'draft',
    },
    loading: false,
    error: null
};

// Async thunk to call API (instructor/exam.json is just a mockup)
export const fetchExam = createAsyncThunk(
    'exam/fetchExam',
    async (examId, thunkAPI) => {
        try {
            const response = await fetch(`http://localhost:5000/api/test/${examId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add the token here
                },
            });
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
            modifiedExamData.questions = Array.isArray(modifiedExamData.questions) 
            ? modifiedExamData.questions.map(question => {
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

export const updateExamAPI = createAsyncThunk(
    'exam/updateExam',
    async ({examId, examData}, thunkAPI) => {
        console.log("Fetching started...");
        console.log("Original Exam Data: ", examData);

        try {
            // Create a copy of examData to avoid directly mutating the original object
            const modifiedExamData = JSON.parse(JSON.stringify(examData));

            // Handle questions: we assume that questions with an _id are already in the DB, so we don't need to remove their ids
            // modifiedExamData.exam.questions = Array.isArray(modifiedExamData.exam.questions)
            //     ? modifiedExamData.exam.questions.map(question => {
            //         // Separate out new questions without _id (i.e., they need to be created)
            //         if (!question._id) {
            //             const { id, ...rest } = question; // Remove any temporary 'id' field you used
            //             return rest; // Return the question without 'id'
            //         }
            //         return question; // For existing questions, return them as-is
            //     })
            //     : [];

            modifiedExamData.questions = Array.isArray(modifiedExamData.questions)
                ? modifiedExamData.questions.map(question => {
                    // Separate out new questions without _id (i.e., they need to be created)
                    if (!question._id) {
                        const { id, ...rest } = question; // Remove any temporary 'id' field you used
                        return rest; // Return the question without 'id'
                    }
                    return question; // For existing questions, return them as-is
                })
                : [];

            console.log("Modified Exam Data for Update: ", modifiedExamData);

            const response = await fetch(`http://localhost:5000/api/test/${examId}`, {
                method: 'PUT',
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
            console.error("Error updating exam:", error);
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
            const { id, ...updatedQuestion } = action.payload;
            const index = state.exam.questions.findIndex(q => q.id === id);
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
        },
        resetExam: (state) => {
            state.exam = {
                _id: null, // Placeholder for exam ID
                title: '', // Placeholder for exam title
                description: '', // Placeholder for exam description
                questions: [], // Empty array to hold questions
                duration: 60,
                access_link: '',
                access_type: 'public',
                start_date: new Date().toISOString(),
                end_date: new Date().toISOString(),
                status: 'draft',
            }; // Or whatever your default state should be
            state.loading = false;
            state.error = null;
        },
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
export const { updateExam, updateQuestion, addQuestion, removeQuestion, resetExam } = examSlice.actions;

// Export reducer to store
export default examSlice.reducer;
