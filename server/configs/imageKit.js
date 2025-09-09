// import ImageKit from "imagekit";

// var imageKit = new ImageKit({
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
// });
// export default imageKit;

import ImageKit from "imagekit";

const getImageKitInstance = () => {
  // Logic khởi tạo và kiểm tra biến môi trường
  if (!process.env.IMAGEKIT_PUBLIC_KEY) {
    throw new Error('Missing IMAGEKIT_PUBLIC_KEY environment variable.');
  }
  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  });
};

// Xuất trực tiếp hàm, không phải kết quả của hàm.
// Điều này đảm bảo code bên trong hàm chỉ chạy khi được gọi.
export default getImageKitInstance;