import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { X, PlusCircle, Trash2, Upload } from 'lucide-react'; // Ensure Upload is imported
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx'; // Import XLSX for Excel parsing

const AddQuestionForm = ({ onClose, onRefresh }) => {
  const [grades, setGrades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [questionType, setQuestionType] = useState('multiple-choice');
  const [questionsList, setQuestionsList] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    fetchGrades();
  }, []);

  useEffect(() => {
    if (selectedGrade) {
      fetchCategoriesByGrade(selectedGrade);
      setSelectedCategory('');
      setGroups([]);
      setSelectedGroup('');
    } else {
      setCategories([]);
    }
  }, [selectedGrade]);

  useEffect(() => {
    if (selectedCategory) {
      fetchGroupsByCategory(selectedCategory);
      setSelectedGroup('');
    } else {
      setGroups([]);
    }
  }, [selectedCategory]);

  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/instructor/grades/getAll', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGrades(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách khối!');
    }
  };

  const fetchCategoriesByGrade = async (gradeId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/instructor/category/getCategoryByGrade', {
        params: { grade_id: gradeId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách môn học!');
    }
  };

  const fetchGroupsByCategory = async (categoryId) => {
    try {
      const response = await axios.get('http://localhost:5000/api/instructor/groups/byCategory', {
        params: { category_id: categoryId },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGroups(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách chương!');
    }
  };

  const handleAddQuestion = () => {
    setQuestionsList([
      ...questionsList,
      { question_text: '', options: ['', ''], correct_answer: null, question_type: questionType },
    ]);
  };

  const handleCorrectAnswerChange = (questionIndex, optionValue) => {
    const updatedQuestions = [...questionsList];

    // Nếu đáp án đã có trong danh sách, thì xóa nó; nếu không, thêm vào
    const isAlreadySelected = updatedQuestions[questionIndex].correct_answers?.includes(optionValue);

    if (isAlreadySelected) {
      updatedQuestions[questionIndex].correct_answers =
        updatedQuestions[questionIndex].correct_answers.filter((ans) => ans !== optionValue);
    } else {
      updatedQuestions[questionIndex].correct_answers =
        [...(updatedQuestions[questionIndex].correct_answers || []), optionValue];
    }

    setQuestionsList(updatedQuestions);
  };

  const handleUploadExcel = () => {
    if (!excelFile) {
      toast.error('Vui lòng chọn tệp Excel!');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const questionsFromExcel = json.slice(1).map((row) => {
        const questionText = row[0];
        const options = row.slice(1, row.length - 1).filter((opt) => opt);
        const correctAnswer = row[row.length - 1]; // Đáp án đúng từ Excel

        // Kiểm tra nếu đáp án đúng nằm trong danh sách các options
        const correctAnswers = options.includes(correctAnswer)
          ? [correctAnswer]
          : [];

        return {
          question_text: questionText,
          options: options,
          correct_answers: correctAnswers, // Đánh dấu đáp án đúng
          question_type: 'multiple-choice',
          grade_id: selectedGrade,
          category_id: selectedCategory,
          group_id: selectedGroup,
        };
      });

      setQuestionsList((prev) => [...prev, ...questionsFromExcel]);
      toast.success('Đã tải lên tệp Excel thành công!');
    };

    reader.readAsArrayBuffer(excelFile);
  };


  const handleRemoveQuestion = (index) => {
    setQuestionsList(questionsList.filter((_, i) => i !== index));
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[questionIndex].options.push('');
    setQuestionsList(updatedQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestionsList(updatedQuestions);
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleSaveAllQuestions = async () => {
    if (!selectedGrade || !selectedCategory || !selectedGroup) {
      toast.error('Vui lòng chọn đầy đủ khối, môn và chương.');
      return;
    }

    const invalidQuestions = questionsList.some(
      (q) =>
        !q.question_text || q.options.length < 2 || !q.correct_answers || q.correct_answers.length === 0
    );

    if (invalidQuestions) {
      toast.error('Mỗi câu hỏi phải có ít nhất 2 đáp án và một đáp án đúng.');
      return;
    }

    try {
      const formattedQuestions = questionsList.map((question) => ({
        ...question,
        grade_id: selectedGrade,
        category_id: selectedCategory,
        group_id: selectedGroup,
        options: question.options.filter((opt) => opt.trim() !== ''), // Bỏ đáp án rỗng
      }));

      console.log('Dữ liệu gửi lên:', formattedQuestions); // Kiểm tra log

      await axios.post(
        'http://localhost:5000/api/instructor/questions/create/multiple',
        formattedQuestions,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      setQuestionsList([]);
      toast.success('Đã lưu tất cả câu hỏi thành công!');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu câu hỏi:', error);
      toast.error('Đã xảy ra lỗi khi lưu câu hỏi.');
    }
  };



  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold">Thêm Câu Hỏi</h3>
          <button onClick={onClose}>
            <X className="text-red-500 hover:text-red-700" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Select Kiểu Câu Hỏi */}
          <div className="mb-4">
            <label className="block mb-2">Chọn Kiểu Câu Hỏi:</label>
            <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="multiple-choice">Multiple Choice</option>
              <option value="essay">Essay</option>
              <option value="choice">Choice</option>
            </select>
          </div>

          {/* Select Khối */}
          <div className="mb-4">
            <label className="block mb-2">Chọn Khối:</label>
            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="">Chọn Khối</option>
              {grades.map((grade) => (
                <option key={grade._id} value={grade._id}>{grade.name}</option>
              ))}
            </select>
          </div>

          {/* Select Môn */}
          <div className="mb-4">
            <label className="block mb-2">Chọn Môn:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-2 border rounded-lg" disabled={!categories.length}>
              <option value="">Chọn Môn</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Select Chương */}
          <div className="mb-4">
            <label className="block mb-2">Chọn Chương:</label>
            <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="w-full p-2 border rounded-lg" disabled={!groups.length}>
              <option value="">Chọn Chương</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
          </div>

          {/* Chọn upload file */}
          <div className="mb-4">
            <label className="block mb-2">Tải lên tệp Excel:</label>
            <input type="file" accept=".xlsx" onChange={handleFileChange} className="mb-2" />
            <button onClick={handleUploadExcel} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              <Upload className="inline mr-2" /> Tải lên Excel
            </button>
          </div>

          {/* Danh sách câu hỏi */}
          {questionsList.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4>Câu hỏi {qIndex + 1}</h4>
                <button onClick={() => handleRemoveQuestion(qIndex)}>
                  <Trash2 className="text-red-500 hover:text-red-700" />
                </button>
              </div>

              {/* Textarea nhập nội dung câu hỏi */}
              <textarea
                value={question.question_text}
                onChange={(e) => {
                  const updatedQuestions = [...questionsList];
                  updatedQuestions[qIndex].question_text = e.target.value;
                  setQuestionsList(updatedQuestions);
                }}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Nhập câu hỏi"
              />

              {/* Render danh sách đáp án */}
              {question.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center mb-2">
                  {/* Checkbox với giá trị là nội dung đáp án */}
                  <input
                    type="checkbox"
                    name={`correct_answer_${qIndex}`}
                    value={opt}
                    checked={question.correct_answers?.includes(opt)}
                    onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                    clas
                    sName="mr-2"
                  />
                  {/* Input để chỉnh sửa đáp án */}
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updatedQuestions = [...questionsList];
                      updatedQuestions[qIndex].options[oIndex] = e.target.value;
                      setQuestionsList(updatedQuestions);
                    }}
                    className="flex-1 p-2 border rounded-lg mr-2"
                  />

                  {/* Nút xóa đáp án */}
                  <button onClick={() => handleRemoveOption(qIndex, oIndex)}>
                    <Trash2 className="text-red-500 hover:text-red-700" />
                  </button>
                </div>
              ))}

              <button onClick={() => handleAddOption(qIndex)} className="text-blue-500 hover:text-blue-700">
                <PlusCircle className="inline mr-1" /> Thêm đáp án
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between p-4 border-t sticky bottom-0 bg-white z-10">
          <button onClick={handleAddQuestion} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Thêm Câu Hỏi
          </button>
          <button onClick={handleSaveAllQuestions} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Lưu Tất Cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionForm;
