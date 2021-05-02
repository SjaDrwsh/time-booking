import { TimeSlotResponse } from "interfaces/response";
import { getTimeSlotsData } from "testData/timeSlot/timeSlot";

export class TimeSlotApiFacade {

    public async getTimeSlots(): Promise<TimeSlotResponse[]> {
        // Here i would have added the get call to backend point
        // I wil just mock the data from the provided JSON folder    
        return getTimeSlotsData();
      }

}

export let timeSlotApiFacade = new TimeSlotApiFacade();