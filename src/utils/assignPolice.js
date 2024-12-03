import axios from 'axios';
import { getToken } from './const';
import { decryptToken } from '../authUtils';

const getAllUserUrl = process.env.REACT_APP_POLICE_DATA;

// const token1 = decryptToken(encryptedToken);

export const assignPolice = async ()=>{
    const encryptedToken = getToken();
    const token1 = decryptToken(encryptedToken);

    try{
        const response = await axios.get(getAllUserUrl , {
            headers: {
                Authorization : `Bearer ${token1}`
            }
        });

        console.log(JSON.parse(response.data.body));
        const users = JSON.parse(response.data.body);
        const police = users.filter((user) => user.role === 'investigator' );

        if (police.length === 0) {
            console.error('No police officers available.');
            return null;
        }

        console.log(police);

        const sortedPolice = police.sort((a,b)=> {
            const specializationMatchA = a.specialization === 'Cyber Crime - Ransomware Attack' ? 1 : 0;
            const specializationMatchB = b.specialization === 'Cyber Crime - Ransomware Attack'? 1 : 0;

            if (specializationMatchA !== specializationMatchB) {
                return specializationMatchB - specializationMatchA;
            }
 
            // Experience (higher is better)
            if (parseInt(b.experience) !== parseInt(a.experience)) {
                return parseInt(b.experience) - parseInt(a.experience);
            }
 
            // Assigned cases (lower is better)
            if (a.assignedCases !== b.assignedCases) {
                return a.assignedCases - b.assignedCases;
            }
 
            // Finished cases (higher is better)
            return b.finishedCases - a.finishedCases;
        });

        const selectedPolice = sortedPolice[0];
        console.log('Assigned Police Officer', selectedPolice);

        return selectedPolice;

    }catch(error){
        console.log("Error assigning Police",error);
        return null;
    }
}

//function to get the police name according to the policeid passed from the parent component.
//This function is used in chat component that is rendered in the case details page
export const getPoliceName = async (policeid)=>{
    const encryptedToken = getToken();
    const token1 = decryptToken(encryptedToken);

    try{
        const response = await axios.get(getAllUserUrl,{
            headers: {
                Authorization : `Bearer ${token1}`
            }
        });

        const users = JSON.parse(response.data.body);
        const police = users.filter((user) => user.role === 'investigator' && user.personid === policeid);
        const name = police[0].name;
        console.log(name);
        return name;
        

    }catch(error){
        console.log("Error getting Police Name",error);
        
    }
}

//function to update the assigned cases in the user data for the investigator
export const updateAssignedCases = async (officer)=>{
    try{
        const url = process.env.REACT_APP_PATCH_POLICE_DATA_URL;
        const updatedOfficerData = {
            personid: officer.personid, // Officer's unique ID
            updatedFields: {
                assignedCases: officer.assignedCases + 1, // Increment assigned cases
            },
        };

        const encryptedData = getToken();
        const token = decryptToken(encryptedData);

        const response = await axios.patch(
            url,
            updatedOfficerData,
            {
                headers:{
                    'Content-Type':'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if(response.status === 200){
            console.log("Assigned Cases updated successfully",response.data);
            return response.data;
        }else{
            console.error("Failed to update assigned cases",response);
            return null;
        }
    }catch(error){
        console.log("Error updating assigned cases",error);
        return null;
    }
}       

