import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, ',/public/img');
    },
    filename: (req, file, callback) => {
        const newFileName = Date.now() + "-" + file.originalname;
        callback(null, newFileName);
    }
});

//se crea el middleware
const uploader = multer({ storage });

export default uploader;