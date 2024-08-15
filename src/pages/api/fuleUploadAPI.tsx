import fs from 'fs';
import path from 'path';
import formidable, { Fields, Files } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form:any = formidable({
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true,
    filename: (name:any, ext:any, part:any) => fileNameChange(name, ext, part),
  });

  const fileNameChange = (name:any, ext:any, part:any) =>{
    return `${Date.now()}-${part.originalFilename}`
  }

  // Ensure the upload directory exists
  await fs.promises.mkdir(form.uploadDir, { recursive: true });

  try {
    const { fields, files } : {fields: Fields, files: Files} = await new Promise((resolve, reject) => {
      form.parse(req, (err: any, fields: Fields, files: Files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // File processing after parsing
    const file:any = files.file;
    let uploadDIR:string = form.uploadDir != undefined ? form.uploadDir : '/public/uploads';
    for (let index = 0; index < file.length; index++) {
        let extention = file[index].newFilename.split('.').pop();    
        let newFilename:string = file[index].newFilename != undefined ? file[index].newFilename : `${Date.now()}-tempfile-1.jpg`;
        let newFilePath = path.join(uploadDIR, newFilename);
        await fs.promises.rename(file[index].filepath, newFilePath);
    }

    return res.status(200).json({ message: 'File uploaded successfully', data: {file: file, form: form} });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred during file upload' });
  }
};

export default handler;
