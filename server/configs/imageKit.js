// import ImageKit from "imagekit";

// var imageKit = new ImageKit({
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
//     urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
// });
// export default imageKit;

import ImageKit from "imagekit";

const getImageKitInstance = () => {
  if (!process.env.IMAGEKIT_PUBLIC_KEY) {
    throw new Error('Missing IMAGEKIT_PUBLIC_KEY environment variable.');
  }
  return new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  });
};

const imageKit = getImageKitInstance();
export default imageKit;