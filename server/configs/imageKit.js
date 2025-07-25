import ImageKit from "imagekit";

var imagekit = new ImageKit({
    publicKey : process.env.Imagekit_PUBLIC_KEY,
    privateKey : process.env.Imagekit_PRIVATE_KEY,
    urlEndpoint : process.env.Imagekit_URL_ENDPOINT
});

export default imagekit;