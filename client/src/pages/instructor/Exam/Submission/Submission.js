import { useState } from 'react';
import { Input, Typography, Avatar, Drawer } from 'antd';
import SubmissionDetail from './SubmissionDetail/SubmissionDetail';
const { Search } = Input;
const { Text } = Typography;

function Submission() {
    const [data, setData] = useState([
        {
            id: 1,
            imgSrc: "https://animecorner.me/wp-content/uploads/2022/05/blue-lock-pv.png",
            studentName: "Ha Trong Tan",
            email: "tanhtde170068@fpt.edu.vn",
            class: "DE170068",
            deadline: "09:00 - 30/09/2024",
            chosenSentence: 10,
            rightSentence: 1,
            grade: "waiting for mark"
        },
        {
            id: 2,
            imgSrc: "https://th.bing.com/th/id/R.1faf912ab6a3ee315a5522416da4e9be?rik=fypyxl9i%2b%2fVpDg&pid=ImgRaw&r=0",
            studentName: "Edd",
            email: "tanhtde170068@fpt.edu.vn",
            class: "",
            deadline: "09:00 - 30/09/2024",
            chosenSentence: 10,
            rightSentence: 1,
            grade: "1"
        },
    ]);
    // Drawer state
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Event handler to show drawer with row details
    const handleRowClick = (row) => {
        setSelectedRow(row);
        setIsDrawerVisible(true);
    };

    // Event handler to close the drawer
    const handleCloseDrawer = () => {
        setIsDrawerVisible(false);
        setSelectedRow(null);
    };

    const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (
        <>
            <div className="w-5/6 mx-auto mt-5">
                <div className='mb-4'>
                    <Search
                        size='large'
                        placeholder="Type search keywords"
                        onSearch={onSearch}
                        style={{
                            width: 300,
                        }}
                    />
                </div>
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead class="text-xs text-gray-700 uppercase border-b">
                            <tr>
                                <th scope="col" class="px-3 py-3">

                                </th>
                                <th scope="col" class="px-2 py-3">
                                    Student
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Class
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Submission deadline
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    Chosen sentence
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    Right sentence
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    Grade
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={row.id}
                                    class="bg-white border-b hover:bg-gray-50 hover:cursor-pointer"
                                    onClick={() => handleRowClick(row)}
                                >
                                <th class="px-2 text-center">
                                    <div className='flex justify-center items-center'>
                                    {/* <img class="rounded-full w-10 h-10 object-cover" src={row.imgSrc} alt="image description"/> */}
                                    <Avatar size="large" src={<img src={row.imgSrc} alt="avatar" />} />
                                    </div>
                                </th>
                                <th scope="row" class="px-2 py-4 text-gray-900">
                                    <div className='flex flex-col justify-start whitespace-nowrap'>
                                        {row.studentName}
                                        <Text className='text-gray-500 font-thin' underline>{row.email}</Text>
                                    </div>
                                </th>
                                <td class="px-6 py-4">
                                    {row.class}
                                </td>
                                <td class="px-6 py-4">
                                {row.deadline}
                                </td>
                                <td class="text-center">
                                {row.chosenSentence}
                                </td>
                                <td class="text-center">
                                {row.rightSentence}
                                </td>
                                <td class="text-center">
                                {row.grade}
                                </td>
                            </tr>
                            ))}
                            
                        </tbody>
                    </table>
                </div>
                {/* Drawer for row details */}
                <SubmissionDetail 
                    visible={isDrawerVisible}
                    onClose={handleCloseDrawer}
                    student={selectedRow}
                />
            </div>
        </>
    );
}

export default Submission;