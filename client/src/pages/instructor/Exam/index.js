import { useState } from "react";
import ExamHeader from "./ExamHeader";
import ExamCreate from "./ExamCreate";
import Submission from "./Submission";
import 'styles/instructor/ExamMain.css'


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

    const onChangeTab = (key) => {
        setActiveTab(key)
    }

    return ( 
        <div className="">
            <ExamHeader items={items} activeTab={activeTab} onChangeTab={onChangeTab}/>
            <div className="mt-24">
                {activeTab === '1' && <ExamCreate/>}
                {activeTab === '2' && <Submission/>}
            </div>
        </div>
     );
}

export default Exam;