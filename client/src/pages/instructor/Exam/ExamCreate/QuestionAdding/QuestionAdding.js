import { LayoutTemplate, Upload, Folder, BotMessageSquare, Plus } from "lucide-react";

function QuestionAdding({handleAddQuestion}) {
    return (
        <>
            <div className="fixed bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg flex space-x-4 border-2">
                <button className="flex flex-col items-center">
                    <LayoutTemplate />
                    <div className="text-xs" >Section</div>
                </button>
                <button className="flex flex-col items-center">
                    <Upload />
                    <div className="text-xs" >Upload files</div>
                </button>
                <button className="flex flex-col items-center">
                    <Folder />
                    <div className="text-xs" >Library</div>
                </button>
                <button className="flex flex-col items-center">
                    <BotMessageSquare />
                    <div className="text-xs" >AI</div>
                </button>
                <button onClick={handleAddQuestion} className="button-normal-custom p-2">
                    <Plus />
                    Add question
                </button>
            </div>
        </>
    );
}

export default QuestionAdding;