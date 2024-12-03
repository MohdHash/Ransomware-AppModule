import jsPDF from 'jspdf';

// Function to fetch image and convert it to base64 (browser-compatible)
const fetchImageAsBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1]; // Get the base64 part
            resolve(`data:image/png;base64,${base64String}`);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

//to generate the FIR COPY and this accepts the case item as a argument in the function to be used while generating the FIR copy
export const generateFIRCopy = async (caseItem) => {
    const individualDetails = JSON.parse(caseItem.individualdetails);
    console.log(caseItem);
    console.log(individualDetails);
    // Create a new PDF document
    const doc = new jsPDF();

    // Set up a border around the page
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287); // Border around the document

    // Set up the background color and header
    doc.setFillColor(0, 51, 102); // DiGiPo Portal Color
    doc.rect(0, 0, 210, 40, 'F'); // Header Rectangle

    // Add DiGiPo Portal Header
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255); // White Text
    doc.text('DiGiPo Complaint Copy', 105, 25, { align: 'center' });

    // Insert DiGiPo Logo
    const imageUrl = 'https://i.ibb.co/qR43n8z/logodigipoloader.png';
    const base64Image = await fetchImageAsBase64(imageUrl);
    doc.addImage(base64Image, 'PNG', 10, 5, 30, 30); // Optionally add logo

    // Title and Case Information
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Cyber Crime Ransomeware', 105, 50, { align: 'center' });

    // Case ID and other metadata
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text for normal case info
    doc.text(`Case ID: ${caseItem.complaintid}`, 20, 65);
    doc.text(`Date of Report: ${new Date().toLocaleDateString()}`, 20, 70);
    doc.text(`Category: Cyber Crime Ransomeware`, 20, 75);

    // Narrative Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black Text for Narrative
    doc.text('Case Details:', 20, 90);
    doc.setFontSize(13);
    const narrative = `On ${new Date().toLocaleDateString()}, a kidnapping complaint was filed under Case ID ${caseItem.complaintid}. The victim, identified as ${
        caseItem.victimName || 'N/A'
    } has reported ransomeware attack of type ${individualDetails.ransomware_type} and the ransomeware amount demanded was reported as USD ${individualDetails.ransom_amount} .The complainant, ${
        individualDetails.complainant_name || 'N/A'
    }, reported the incident at approximately ${individualDetails.incident_date || 'N/A'}. Currently, the case status is ${
        caseItem.casestatus || 'Pending'
    }.`;

    // Add narrative text to the document with wrapping
    doc.text(narrative, 20, 96, { maxWidth: 180 });

    // Incident Details Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102); // Section Title Color
    doc.text('Incident Details:', 20, 140);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Normal Text Color
    doc.text(`Victim Name: ${caseItem.victimName || 'N/A'}`, 20, 145, { maxWidth: 180 });
    doc.text(`reported at : ${individualDetails.incident_date  || 'N/A'}`, 20, 150, { maxWidth: 180 });
    doc.text(`Location: ${caseItem.individualdetails.incident_location || 'Anonymous'}`, 20, 155, { maxWidth: 180 });
    doc.text(`Ransomeware type: ${individualDetails.ransomware_type || 'N/A'}`, 20, 160, { maxWidth: 180 });

    // Investigation Details
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Investigation Details:', 20, 175);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Investigator ID: ${caseItem.policeid || 'N/A'}`, 20, 180);
    doc.text(`Investigation Status: ${caseItem.casestatus || 'Pending'}`, 20, 185);

    // Case Status Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Case Status:', 20, 200);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`FIR Filed: ${caseItem.isfirfiled ? 'Yes' : 'No'}`, 20, 205);
    doc.text(`Case Status: ${caseItem.casestatus || 'Pending'}`, 20, 210);

    // Important note about the kidnapping case
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0); // Red Text for special notes
    doc.text('Important Note: This is a Ransomeware case, and ongoing investigation is in progress to locate the victim and apprehend the suspects.', 20, 230, { maxWidth: 180 });

    // Seal - Add a circular seal at the bottom left with "DiGiPo" spelled in it
    doc.setFillColor(255, 0, 0); // Red color for the seal
    doc.circle(23, 265, 15, 'F'); // Draw filled circle for the seal
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255); // White text for the seal
    doc.text('FIR FILED', 22.5, 265, { align: 'center' });

    // Digital Signature placeholder at the bottom right
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text for signature
    doc.text('Digital Signature:', 150, 270);
    doc.setFont('Courier', 'normal');
    doc.setFontSize(10);
    doc.text('This is an auto-generated document.', 115, 275);
    doc.text('It is valid without a physical signature.', 115, 280);

    // Footer Section
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('This document was generated by DiGiPo Portal. All rights reserved.', 105, 290, { align: 'center' });

    // Save the document as a PDF
    doc.save(`FIR_Case_${caseItem.complaintid}.pdf`);
};

//function to generate the CSR copy and similarly this also accepts the complaint details as the argument to be used while generating the CSR copy
export const generateComplaintCopy = async (complaintDetails) => {
    const doc = new jsPDF();
  console.log(complaintDetails);
  const individual = JSON.parse(complaintDetails.individualdetails);
  console.log(individual);
    // Set up the document border
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287);
  
    // Header
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('DiGiPo Cybercrime Complaint Copy', 105, 25, { align: 'center' });
  
    // Logo
    const logoUrl = 'https://i.ibb.co/qR43n8z/logodigipoloader.png';
    const base64Image = await fetchImageAsBase64(logoUrl);
    doc.addImage(base64Image, 'PNG', 10, 5, 30, 30);
  
    // Case Information Section
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Community Service Register', 105, 50, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Complaint ID: ${complaintDetails.complaintid}`, 20, 65);
    doc.text(`Date of Report: ${new Date().toLocaleDateString()}`, 20, 70);
    doc.text('Category: Cybercrime - Ransomware', 20, 75);
  
    // Case Details Section
    doc.setFontSize(12);
    doc.text('Case Details:', 20, 90);
    const narrative = `On ${new Date().toLocaleDateString()}, a ransomware complaint was filed under ID ${complaintDetails.complaintId}. 
      The victim, ${complaintDetails.victimName},
      reported a ransomware attack demanding ${individual.ransom_amount || 'N/A'}.
      The complainant, ${individual.complainant_name || 'N/A'},
      described the incident as follows: ${individual.description || 'N/A'}.`;
    doc.text(narrative, 20, 95, { maxWidth: 180 });
  
    // Ransomware Details Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Ransomware Details:', 20, 130);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Type of Ransomware: ${individual.ransomware_type || 'N/A'}`, 20, 135);
    doc.text(`Ransom Amount: ${individual.ransom_amount|| 'N/A'}`, 20, 140);
    doc.text(`Incident Date: ${individual.incident_date || 'N/A'}`, 20, 145);
  
    // Complainant Details Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Complainant Details:', 20, 160);
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Complainant Name: ${individual.complainant_name || 'N/A'}`, 20, 165);
    doc.text(`Contact Number: ${individual.complainant_contact || 'N/A'}`, 20, 170);
    doc.text(`Email Address: ${individual.complainant_email || 'N/A'}`, 20, 175);
  
    // Case Status Section
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Case Status:', 20, 190);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`FIR Filed: ${complaintDetails.isfirfiled ? 'Yes' : 'No'}`, 20, 195);
    doc.text(`Current Status: ${complaintDetails.casestatus || 'Pending'}`, 20, 200);
  
    // Important Note Section
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0); 
    doc.text(
      'Important Note: This case involves a cybercrime of ransomware, currently under investigation to track the source and prevent further harm.',
      20,
      220,
      { maxWidth: 180 }
    );
  
    // Seal Section
    doc.setFillColor(255, 0, 0);
    doc.circle(23, 265, 15, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('FIR FILED', 22, 265, { align: 'center' });
  
    // Digital Signature Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Digital Signature:', 150, 270);
    doc.setFont('Courier', 'normal');
    doc.setFontSize(10);
    doc.text('This is an auto-generated document.', 115, 275);
    doc.text('It is valid without a physical signature.', 115, 280);
  
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('This document was generated by DiGiPo Portal. All rights reserved.', 105, 290, { align: 'center' });
  
    // Return the PDF content as base64 string
    doc.save(`FIR_Case_${complaintDetails.complaintid}.pdf`) 
 // This will return the PDF as a base64 data URI string
  };