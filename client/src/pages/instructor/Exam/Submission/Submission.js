import { useState, useEffect } from 'react';
import { Input, Typography, Avatar, Drawer, message } from 'antd';
import SubmissionDetail from './SubmissionDetail';

const { Search } = Input;
const { Text } = Typography;

function Submission({ examId }) {


  return (
    <>
      <div className="w-5/6 mx-auto mt-5">
        <div className='mb-4'>
          <Search
            size='large'
            placeholder="Type search keywords"

            style={{
              width: 300,
            }}
          />
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase border-b">
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-2 py-3">Student</th>
                <th scope="col" className="px-6 py-3">Class</th>
                <th scope="col" className="px-6 py-3">Submission deadline</th>
                <th scope="col" className="px-6 py-3 text-center">Chosen sentence</th>
                <th scope="col" className="px-6 py-3 text-center">Right sentence</th>
                <th scope="col" className="px-6 py-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>

              <tr

                className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer"

              >
                <th className="px-2 text-center">
                  <div className='flex justify-center items-center'>
                    <Avatar size="large" src={<img alt="avatar" />} />
                  </div>
                </th>
                <th scope="row" className="px-2 py-4 text-gray-900">
                  <div className='flex flex-col justify-start whitespace-nowrap'>

                    <Text className='text-gray-500 font-thin' underline></Text>
                  </div>
                </th>
                <td className="px-6 py-4">

                </td>
                <td className="px-6 py-4">

                </td>
                <td className="text-center">

                </td>
                <td className="text-center">

                </td>
                <td className="text-center">

                </td>
              </tr>

              <tr>
                <td colSpan="7" className="text-center py-4">No submissions found for this test</td>
              </tr>

            </tbody>
          </table>
        </div>
        {/* Drawer for row details */}
        <SubmissionDetail
        />
      </div>
    </>
  );
}

export default Submission;
