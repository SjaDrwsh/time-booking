export interface TimeSlotResponse{
    id: number;
    name: string;
    type: string;
    time_slots: TimeSlotData[];

}


export interface TimeSlotData{
    start_time: string;
    end_time: string;
}

export interface Error {
    stack?: string;
}