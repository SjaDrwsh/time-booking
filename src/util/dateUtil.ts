import { TimeSlotData } from "interfaces/response";

// array to map name of the day and sunday is day 0 
export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export interface groupedDates {
    [key: string]: TimeSlotData[]
}

export function groupByDay(timeSlotsArray: TimeSlotData[]): groupedDates{
    
    const daysObject: groupedDates = {};

    for (const iterator of timeSlotsArray) {
        const startDate = new Date(iterator.start_time);
        const day = days[startDate.getDay()];
        if(!daysObject[day]){
            daysObject[day] = [];
        }
        daysObject[day].push({start_time: iterator.start_time, end_time: iterator.end_time});
    }
    
    for (const key in daysObject) {
        daysObject[key] = sortDates(daysObject[key]);
    }
    return daysObject;

}

export function sortDates(dates: TimeSlotData[]): TimeSlotData[]{
    return dates.sort(function(a, b) {
        return (a.start_time < b.start_time) ? -1 : ((a.start_time > b.start_time) ? 1 : 0);
    });
} 

export function convertDateToReadableFormat(date: string): string{
    const newDate = new Date(date);
    return `${newDate.getHours()}:${newDate.getMinutes()}`;
}