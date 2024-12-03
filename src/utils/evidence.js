import axios from "axios";
import { getToken } from "./const";
import { decryptToken } from "../authUtils";

const fetchfileurl = process.env.REACT_APP_FETCHFILE_API;
const uploadfileurl = process.env.REACT_APP_UPLOAD_API;
// const encryptedToken = sessionStorage.getItem('jwt');

//function to fetch the evidence from the s3 bucket
// used in the case details page to get the evidence page
export const fetchEvidenceFiles = async (caseId) => {
    const encryptedToken = sessionStorage.getItem('jwt');
    // if (!encryptedToken) {
    //     return;
    //   }
    const token1 = decryptToken(encryptedToken);

    const payload = {
        body:{
            folderName:caseId.toString()
        }
    }
  try {
    const response = await axios.post(fetchfileurl, payload , {
        headers: {
              Authorization: `Bearer ${token1}`,
             'Content-Type': 'application/json'
        }
    });
    const {files}= JSON.parse(response.data.body);
    console.log(files);
    return files;

  } catch (error) {
    console.error("Failed to fetch evidence files:", error);
    throw error;
  }
};

//function to upload the evidence files to be used in the case details page.
export const uploadEvidenceFile = async (caseId, file) => {
    
  try {
    const folderName = caseId.toString();
    const payload = {
        body: {
          folderName,
          fileName: file.name,
          fileType: file.type,
          isEvidence: true,
        },
      };
    // Request pre-signed URL from the backend
    const response = await axios.post(uploadfileurl, payload);
    console.log(JSON.parse(response.data.body));// Assuming your API returns the pre-signed URL
    const {url} = JSON.parse(response.data.body);
    console.log(url);

    // Upload the file to S3 using the pre-signed URL
    const response1 = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      if (response1.status === 200) {
        console.log("File uploaded successfully!");
      }
  } catch (error) {
    console.error("Failed to upload evidence file:", error);
    throw error;
  }
};
