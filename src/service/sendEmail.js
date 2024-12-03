import axios from "axios"

//send compaint function to be used for sending the mail on registering a complaint
export const sendComplaintMail = async (complaintDetails)=>{
    console.log(complaintDetails);
    console.log(complaintDetails.complainantEmail)
    // const file = await generateComplaintCopy(complaintDetails);
    // console.log(file);
    const subject = 'Complaint Copy'
    const message = `
Dear ${complaintDetails.complainantName},

We have successfully received your complaint submission regarding the following issue:

Complaint ID: ${complaintDetails.complaintID}
Decription: ${complaintDetails.description}


Thank you for reaching out to us. We understand the importance of addressing your concerns promptly. Our force is currently reviewing the details, and we will keep you updated as we make progress in processing your complaint. 

If you need further assistance or have additional information that could help us expedite the resolution, please don’t hesitate to reach out.

Sincerely,

DiGiPo Cybercrime Team
Email : support.cybercrime@digipo.com
Contact Number:  +1 (800) 555-0102

This message is an automated response confirming the receipt of your complaint. Please do not reply to this email.
`;

    const url = process.env.REACT_APP_EMAILPDF_API;
    try{
        const payload = {
            recipient_email: complaintDetails.complainantEmail,
            subject: subject,
            message_body:message,
        }

        const response = await axios.post(url, payload , {
            headers:{
                'Content-Type':'application/json'
            }
        })
    }catch(error){
        console.log("Failed to sent the mail");
    }
    
}