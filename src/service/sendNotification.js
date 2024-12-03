import axios from 'axios';
import { getToken } from '../utils/const';
import { decryptToken } from '../authUtils';
//function to send the sms and whatspp notification to the user
export const sendSMS = async (phoneNumber)=>{
    const encryptedToken = getToken(); // token are being fetched from the session storage and decrypted within the function scope to prevent split error
    const token = decryptToken(encryptedToken);
    try{
        const url = process.env.REACT_APP_SNS_URL;
        const payload = {
            phone_number:phoneNumber,
            message:"You have successfully filed a case on Cyber crime Ransomware division of DiGiPo Portal"
        }

        const response = await axios.post(url , payload, {
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response);
    }catch(error){
        console.log("Error sending SMS",error);
    }
}

export const sendWhatsappMsg = async (phoneNumber)=>{
    console.log(phoneNumber);
    console.log("entered whatsap");
    const encryptToken = getToken();
    const token = decryptToken(encryptToken);
    try{
        const url = process.env.REACT_APP_WHATSAPP_API;
        const payload = {
            to:phoneNumber,
            message:"You have successfully filed a case on Cyber crime Ransomware division of DiGiPo Portal"
        }

        const response = await axios.post(url , payload , {
            headers:{
                'Content-Type':'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        console.log(response);
    }catch(error){
        console.log("Error sending Whatsapp Message",error);
    }

}