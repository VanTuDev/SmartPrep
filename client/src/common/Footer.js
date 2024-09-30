import React from "react";
import { Layout, Select } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { Mail, MapPin, PhoneCall, SmartphoneCharging } from "lucide-react";

const { Footer } = Layout;
const { Option } = Select;

const CustomFooter = () => {
   return (
      <Footer className="bg-gray-100 text-gray-700 py-10 px-5">
         <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start">
               {/* Contact Information Section */}
               <div className="w-full md:w-2/5 mb-8 md:mb-0">
                  <h2 className="text-xl font-bold mb-4">Thông tin liên hệ</h2>
                  <div className="space-y-4">
                     <div className="flex items-center">
                        <PhoneCall alt="Phone" className="w-6 h-6 mr-2" />
                        <p>028 22188 009</p>
                     </div>
                     <div className="flex items-center">
                        <SmartphoneCharging alt="Mobile" className="w-6 h-6 mr-2" />
                        <p>086 868 5247</p>
                     </div>
                     <div className="flex items-center">
                        <Mail alt="Email" className="w-6 h-6 mr-2" />
                        <p>Info@ninecode.vn</p>
                     </div>
                     <div className="flex items-center">
                        <MapPin alt="Location" className="w-6 h-6 mr-2" />
                        <p>781/c1 Lê Hồng Phong, P. 12, Quận 10, TP. HCM</p>
                     </div>
                  </div>
               </div>

               {/* Other Links Section */}
               <div className="w-full md:w-3/5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div>
                        <h2 className="text-xl font-bold mb-4">Điều khoản</h2>
                        <div className="flex flex-col space-y-2">
                           <a href="/policy/termofuse" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Điều khoản sử dụng
                           </a>
                           <a href="/policy/termprivacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Điều khoản bảo mật thông tin
                           </a>
                        </div>
                     </div>

                     {/* Guide Section */}
                     <div>
                        <h2 className="text-xl font-bold mb-4">Hướng dẫn</h2>
                        <div className="flex flex-col space-y-2">
                           <a href="/document" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Hướng dẫn
                           </a>
                           <a href="/contact" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Liên hệ hỗ trợ
                           </a>
                        </div>
                     </div>

                     {/* Other Products Section */}
                     <div>
                        <h2 className="text-xl font-bold mb-4">Sản phẩm khác</h2>
                        <div className="flex flex-col space-y-2">
                           <a href="http://ninebooking.one/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              NineBooking
                           </a>
                           <a href="http://ninetick.one/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Nine Tick
                           </a>
                           <a href="https://ninecard.one/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Card Visit Online
                           </a>
                           <a href="https://qrcode-gen.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              QR code
                           </a>
                           <a href="https://ninecode.vn/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                              Software consultant
                           </a>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

            {/* Bottom License and Navigation */}
            <div className="mt-10 flex flex-col md:flex-row justify-between items-center">
               <div className="flex items-center">
                  <GlobalOutlined className="text-gray-400 text-2xl mr-2" />
                  <Select defaultValue="vi" className="w-28">
                     <Option value="vi">Tiếng Việt</Option>
                     <Option value="en">English</Option>
                  </Select>
               </div>

               <div className="mt-4 md:mt-0">
                  <p><span className="font-bold text-primary text-xl">Ninequiz</span> - Một sản phẩm của Ninecode JSC</p>
               </div>

               <ul className="mt-4 md:mt-0 flex space-x-4">
                  <li className="relative flex items-center">
                     <a href="/home" className="hover:text-blue-600">Trang chủ</a>
                  </li>
                  <li className="relative flex items-center before:content-[''] before:absolute before:left-[-12px] before:h-4 before:w-[1px] before:bg-gray-400">
                     <a href="/policy/termofuse" className="hover:text-blue-600">Điều khoản sử dụng</a>
                  </li>
                  <li className="relative flex items-center before:content-[''] before:absolute before:left-[-12px] before:h-4 before:w-[1px] before:bg-gray-400">
                     <a href="/policy/termprivacy" className="hover:text-blue-600">Chính sách bảo mật</a>
                  </li>
               </ul>

            </div>
         </div>
      </Footer>
   );
};

export default CustomFooter;
