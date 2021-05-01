
import { TimeSlotResponse } from "interfaces/response";
import { ReadApiState } from "state/ReadApiState";
import { timeSlotApiFacade } from "./TimeSlotApiFacade";


export class TimeSlotApiService {
    public getTimeSlots = new ReadApiState<TimeSlotResponse[], Error, any[]>(async () => {
        return timeSlotApiFacade.getTimeSlots();
      });
} 

export let timeSlotApiService = new TimeSlotApiService();