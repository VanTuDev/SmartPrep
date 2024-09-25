import React from 'react';
import Header from '../common/Header';
import { CircleArrowRight, CircleCheckBig } from 'lucide-react';
import '../styles/HomePage.css';

const features = [
  "Dễ dàng tạo hoặc upload file câu hỏi trắc nghiệm",
  "Nhiều tùy chọn trộn câu hỏi và tự động chấm bài làm",
  "Tạo bài thi lấy ngẫu nhiên từ ngân hàng câu hỏi trắc nghiệm của bạn",
  "Tích hợp Chat GPT giúp bạn tự động tạo câu hỏi trắc nghiệm",
  "Triển khai thi online hoặc làm bài thi online không cần cài đặt ứng dụng",
];

const feature2 = [
  {
    title: "Thêm câu hỏi trắc nghiệm và tạo bài thi đơn giản hơn bao giờ hết",
    description: [
      "Thêm câu hỏi trắc nghiệm bằng tay với nhiều dạng câu hỏi như: câu hỏi lựa chọn một đáp án, câu hỏi lựa chọn nhiều đáp án, câu hỏi upload file...",
      "Thêm câu hỏi từ Ngân Hàng câu hỏi trắc nghiệm, bạn có thể lấy câu hỏi chỉ định từ ngân hàng câu hỏi hoặc cài đặt bài thi online lấy số lượng câu hỏi ngẫu nhiên từ thư viện câu hỏi cho mỗi bài làm khác nhau.",
      "Tải file danh sách câu hỏi trắc nghiệm có sẵn lên, Ninequiz hỗ trợ các file word, excel, pdf.",
      "Sử dụng AI tạo câu hỏi theo chủ đề của bạn, ví dụ: “tạo câu hỏi trắc nghiệm hoá học lớp 12”.",
      "Tạo câu hỏi từ nội dung của bạn bằng AI, sau khi bạn cung cấp nội dung cho AI, hệ thống sẽ tự động tạo câu hỏi trắc nghiệm từ nội dung tài liệu của bạn."
    ],
    imgSrc: "/image/tao_cau_hoi_trac_nghiem_bang_AI.cd42d636.webp",
    imgAlt: "Tạo câu hỏi trắc nghiệm bằng AI"
  },
  {
    title: "Lên trước lịch thi online hoặc giới hạn thời gian làm bài thi",
    description: [
      "Bạn có thể cài đặt thời gian để học sinh chỉ làm bài thi online trong khung thời gian qui định:",
      "Qui định thời gian cho bài làm (10’, 15’, 45’...)",
      "Qui định thời gian có thể bắt đầu làm bài",
      "Qui định thời gian kết thúc hiệu lực làm bài",
      "Hoặc bỏ cài đặt thời gian để học sinh có thể làm bài bất kì lúc nào cho đến khi nộp bài thành công."
    ],
    imgSrc: "/image/feature2-min.webp",
    imgAlt: "Lên lịch thi online"
  },
  {
    title: "Chia sẻ bài thi và quản lý user có thể làm bài thi",
    description: [
      "Chia sẻ public: Bạn chỉ việc sao chép đường dẫn chia sẻ và gửi cho đối tượng cần làm bài thi hoặc tải và chia sẻ qr code cho học sinh quét qr code truy cập trực tiếp vào bài thi.",
      "Bạn có thể quản lý bài kiểm tra với từng nhóm hoặc lớp bằng cách tạo lớp và thêm học sinh vào lớp:",
      "Quản lý nhóm và lên lịch thi riêng cho từng nhóm, user ngoài danh sách chỉ định sẽ không truy cập bài thi được.",
      "Khi triển khai bài thi chỉ định user thì các user sẽ nhận được thông báo về bài thi."
    ],
    imgSrc: "/image/feature3-min.webp",
    imgAlt: "Chia sẻ bài thi"
  },
  {
    title: "Học sinh làm bài không cần cài đặt thêm ứng dụng",
    description: [
      "Học sinh dễ dàng truy cập và làm bài thi trắc nghiệm online mà không cần cài đặt thêm ứng dụng.",
      "Giao diện làm bài trắc nghiệm online trực quan và dễ tương tác.",
      "Giao diện tùy biến theo kích thước màn hình mà không làm thay đổi chất lượng hình ảnh.",
      "Chỉ cần scan qr code bài thi trắc nghiệm online hoặc truy cập link bài thi và làm bài mà không cần cài đặt ứng dụng.",
      "Trả lời bài thi tự luận bằng cách chụp ảnh bài làm hoặc upload file word."
    ],
    imgSrc: "/image/feature4-min.webp",
    imgAlt: "Học sinh không cần cài đặt ứng dụng"
  }
];

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="relative homepage-container bg-white">
        <div className="bg-white relative pt-32 pb-16">
          <div className="container mx-auto max-w-screen-lg relative z-20">
            <div className="flex flex-wrap items-center justify-between mt-20 pb-[60px]"> {/* Giảm padding-bottom */}
              {/* Phần văn bản */}
              <div className="short-description flex-1">
                <h1 className="text-4xl font-bold mb-6 leading-tight">
                  TẠO BÀI THI TRẮC NGHIỆM ONLINE<br /> MIỄN PHÍ VÀ DỄ SỬ DỤNG
                </h1>
                <div className="short-description__subtext-box-wrapper space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CircleCheckBig className="w-6 h-6 text-blue-600 mr-3" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                  <span className="flex items-center">
                    <CircleArrowRight className="mr-2" />
                    Đăng ký miễn phí
                  </span>
                </button>
              </div>

              {/* Phần hình ảnh */}
              <div className="homepage-banner-image w-full lg:w-[400px] lg:ml-12 mt-[-20px] lg:mt-[-40px]"> {/* Giảm margin-top */}
                <picture>
                  <source
                    srcSet="https://imagedelivery.net/M9PIytK2demVk-gQ5MroBw/940b4fb5-0abe-4d2d-024f-bb8ce7c68700/public"
                    type="image/webp"
                  />
                  <img
                    src="/images/HomePage/ai_for_education.png"
                    alt="AI for education"
                    className="rounded-lg w-full h-auto"
                  />
                </picture>
              </div>
            </div>
          </div>

        </div>

        {feature2.map((feature, index) => (
          <div key={index} className="feature-section-container">
            <div className={`feature-section ${index % 2 === 0 ? 'reverse-layout' : ''}`}>
              <div className="feature-description-container">
                <h2 className="feature-title">{feature.title}</h2>
                <div className="feature-description__list-box-item">
                  {feature.description.map((desc, idx) => (
                    <div key={idx} className="feature-description__item flex items-center">
                      <CircleCheckBig className="mr-3 text-blue-600" width={24} height={24} />
                      <p>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="feature-image-container">
                <picture>
                  <source srcSet={feature.imgSrc} type="image/webp" />
                  <img src={feature.imgSrc} alt={feature.imgAlt} className="feature-image" />
                </picture>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white py-10 px-5">
          <div className="max-w-screen-lg mx-auto">
            <div className="flex justify-center gap-x-10">
              <div className="pricing-container bg-white p-10">
                {/* Cá nhân package */}
                <div className="pricing-card personal">
                  <span className="thumbup-icon">
                    <img src="/image/thumbup.png" alt="thumbup" />
                  </span>
                  <div className="package-name">
                    <p className="h1">Cá nhân</p>
                  </div>
                  <div className="package-price">
                    <p className="h2">MIỄN PHÍ</p>
                  </div>
                  <div className="package-description">
                    <div className="description">
                      <img src="/image/profile.svg" alt="Tạo lớp không giới hạn" />
                      <p>Tạo lớp không giới hạn</p>
                    </div>
                    <div className="description">
                      <img src="/image/task-add.svg" alt="Tạo bài kiểm tra không giới hạn" />
                      <p>Tạo bài kiểm tra vô hạn</p>
                    </div>
                    <div className="description">
                      <img src="/image/cloud-icon.svg" alt="Lưu trữ" />
                      <p>Tối đa 5GB lưu trữ </p>
                    </div>
                  </div>
                  <button className="button-register" type="button">
                    <span className="button-register-label">
                      <span className="button-register-icon">
                        <CircleArrowRight size={20} alt="Register_ninequiz" />
                      </span>
                      <span className="button-register-text">Đăng ký</span>
                    </span>
                  </button>
                </div>

                {/* Doanh nghiệp package */}
                <div className="pricing-card business">
                  <div className="package-name">
                    <p className="h1">Doanh nghiệp</p>
                  </div>
                  <div className="package-price">
                    <p className="h2">TUỲ CHỈNH</p>
                  </div>
                  <div className="package-description">
                    <div className="description">
                      <img src="/image/shield-task.png" alt="Tên miền tuỳ chỉnh" className='w-7'/>
                      <p>Tên miền tuỳ chỉnh</p>
                    </div>
                    <div className="description">
                      <img src="/image/cloud-server.png" alt="Vận hành server riêng" />
                      <p>Vận hành server riêng</p>
                    </div>
                    <div className="description">
                      <img src="/image/cloud-data.svg" alt="Lưu trữ data riêng" />
                      <p>Lưu trữ data riêng</p>
                    </div>
                  </div>
                  <button className="button-register" type="button">
                    <span className="button-register-label">
                      <span className="button-register-icon">
                        <CircleArrowRight size={20} alt="Register_ninequiz" />
                      </span>
                      <span className="button-register-text">Liên hệ</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

