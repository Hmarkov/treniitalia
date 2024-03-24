import axios from "axios";
import { Train } from "../types/interfaces";
const stage_name=""
const api_id=""
const departure=true
const station="ROMA TERMINI"

// const API_URL='https://.execute-api.eu-west-3.amazonaws.com//trains';
const API_URL='https://'+api_id+'.execute-api.eu-west-3.amazonaws.com/'+stage_name+'/trains?departures='+departure+'&station='+station+'';

export const fetchTrains = async (): Promise<Train[]> => {
     try {
       const response = await axios.get(API_URL);
       
       // Assuming the API response contains an array of train objects directly
       const trains: Train[] = response.data.map((trainData: any) => ({
         trainNumber: trainData.number,
         destination: trainData.destination,
         departureTime: trainData.departure_time,
         delay: trainData.delay || 0, // Use 0 if delay is not provided
         platform: trainData.platform || "" // Use an empty string if platform is not provided
       }));
   
       return trains;
     } catch (error) {
          console.error('Error fetching trains',error);
          throw error;
     }
};