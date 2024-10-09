import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ExamHeader from "./ExamHeader/ExamHeader";
import ExamCreate from "./ExamCreate/ExamCreate";
import Submission from "./Submission/Submission";
import 'styles/instructor/ExamMain.css'

//Import using Redux
import { Provider } from 'react-redux';
import { store } from '../../../store/store';


const items = [
    {
        key: '1',
        label: 'Exam',
    },
    {
        key: '2',
        label: 'Submission',
    }
];

function Exam() {
    const [activeTab, setActiveTab] = useState('1');
    const { examId: initialExamId } = useParams();
    const [examId, setExamId] = useState(initialExamId);

    const onChangeTab = (key) => {
        setActiveTab(key)
    }

    useEffect(() => {
        setExamId(initialExamId); // Update local examId when params change
    }, [initialExamId]);
console.log(examId)
    return ( 
        <Provider store={store}>
            <ExamHeader items={items} activeTab={activeTab} onChangeTab={onChangeTab} setExamId={setExamId}/>
            <div className="mt-24">
                {activeTab === '1' && <ExamCreate examId={examId}/>}
                {activeTab === '2' && <Submission/>}
            </div>
        </Provider>
     );
}

export default Exam;