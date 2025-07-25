import fs from 'fs'
import imagekit from '../configs/imageKit.js';
export const addBLog= async (req,res) => {
    try {
        const {title,subTitle,description,category,isPublished}= 
        JSON.parse( req.body.blog);
        const imageFile= req.file;

        if (!title ||!subTitle||!description||!category||!isPublished) {
            return res.json({success:false,message:"Missing Required Fields"})
        }
        const fileBuffer=fs.readFileSync(imageFile.path)
        //Upload Image to Imagekit
        const response=await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:"/blogs"
        })
        //optimiztion through imagekit URL transforamtion
         const optimizedUrl=imagekit.url({
            path:response.filePath,
            transformation:
            [
                {quality:'auto'},
                {format:'webp'},
                {width:'1280'}
                
            ]
         })

    } catch (error) {
        
    }
}