import Image from "next/image";
import { Inter } from "next/font/google";
import { Fragment, useRef, useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [fileData, setFileData] = useState<[]>([]);
  const fileUpload:any = useRef<HTMLFormElement>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState<any | null>(null);

  const handleFileUploadChange = (data:any) =>{
    if(data.target.files){
      if(data.target.files.length > 0){
        let fileData:any = [];
        for (let index = 0; index < data.target.files.length; index++) {
          fileData.push({name: data.target.files[index].name, size: data.target.files[index].size})
        }
        setFileData(fileData)
      }
    }
  }

  const handleFileUpload = async ()=>{
    const formData = new FormData();
      fileData.map((item:any, index:any)=>{
        formData.append('file', fileUpload.current.files[index], fileUpload.current.files[index].name);
      })
      const resultData = await axios.post('/api/fuleUploadAPI', formData,{
        headers: {
            "Content-Type": "multipart/form-data"
        }
      });
      console.log("resultData", resultData);
      if(resultData.data.data){
        setFileUploadStatus(resultData.data.data);
      }
  }

  return (
    <div className="max-w-screen-xl mx-auto my-5">
      <div className="w-full text-3xl">
        <h1>Simple File Upload In Next.JS</h1>
      </div>
      <div className="w-full bg-gray-100 rounded-xl my-7 p-10">
        <h4>File Upload</h4>
        <div className="mt-7">
          <input type="file" multiple className="bg-blue-800 text-white mr-5" onChange={handleFileUploadChange} ref={fileUpload} />
          <button className="bg-blue-800 text-white rounded-md py-1 px-4 hover:bg-green-700" onClick={handleFileUpload}>Upload</button>
        </div>
        <div className="mt-5">
          {fileData && fileData.length > 0 && (
            fileData.map((item:any, index:any)=>{
              return(
                <div key={index}>{index+1} - {item.name}</div>
              )
            })
          )}
          
        </div>
        <div>
          {fileUploadStatus && fileUploadStatus.file.length && (
            <div className="bg-green-800 text-white p-5 rounded-lg mt-5">File Uploaded</div>
          )}
        </div>
      </div>
    </div>
  );
}
