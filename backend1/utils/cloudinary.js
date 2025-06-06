import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary = async (localStorage) => {
    try {
        if (!localStorage)
            return null;
        const responseCloudinary = await cloudinary.uploader.upload(localStorage, {
            resource_type: "auto",
        });
        console.log("file is uploaded on Cloudinary", responseCloudinary.url);
        return responseCloudinary;
    }
    catch (error) {
        fs.unlinkSync(localStorage);
    }
};
export { uploadOnCloudinary };
