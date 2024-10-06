import React, { useState } from 'react'
import VideoModal from './SupportGuideModal';

export default function Support() {

// eslint-disable-next-line react-hooks/rules-of-hooks
const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <div className="App">
      <header className="text-center py-10 bg-gray-800 text-white">
        <h1 className="text-3xl font-bold mb-4">Video Player Modal Example</h1>
        <button
          onClick={() => setModalIsOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition duration-300"
        >
          Open Video Modal
        </button>
      </header>
      
      {/* Modal hiển thị danh sách video */}
      <VideoModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
    </div>
  )
}
