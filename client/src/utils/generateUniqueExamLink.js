export function generateUniqueTestLink() {
    // Lấy thời gian hiện tại và chuyển đổi thành một chuỗi
    const timestamp = new Date().getTime();

    // Tạo một chuỗi unique bằng cách kết hợp timestamp và một số ngẫu nhiên
    const randomPart = Math.random().toString(36).substr(2, 9); // tạo chuỗi ngẫu nhiên
    const uniqueString = `${timestamp}-${randomPart}`;

    // Mã hóa chuỗi unique để tạo một URL safe string
    const encodedString = encodeURIComponent(uniqueString);

    // Giả sử baseURL là địa chỉ URL của trang web của bạn
    const baseURL = "http://localhost:3000";

    // Tạo link URL hoàn chỉnh
    const uniqueLink = `${baseURL}/${encodedString}`;

    return uniqueLink;
}