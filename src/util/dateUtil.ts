import { TimeSlotData } from "interfaces/response";

// array to map name of the day and sunday is day 0 
export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export interface groupedDates {
    [key: string]: SelectedDates[]
}

export interface SelectedDates extends TimeSlotData{
    selected?: boolean;
}

export function groupByDay(timeSlotsArray: SelectedDates[]): groupedDates{
    
    const daysObject: groupedDates = {};

    for (const iterator of timeSlotsArray) {
        const startDate = new Date(iterator.start_time);
        const day = days[startDate.getDay()];
        if(!daysObject[day]){
            daysObject[day] = [];
        }
        daysObject[day].push({start_time: iterator.start_time, end_time: iterator.end_time, selected: iterator.selected});
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

export function mapSelectedTimeSlots(availableTimeSlots: SelectedDates[], selectedDates: groupedDates | undefined): groupedDates{
    if (!selectedDates || Object.keys(selectedDates).length === 0){
        return groupByDay(availableTimeSlots);
    }


    // reset all before checking if available time slot is within a booked time
    availableTimeSlots.map((availableTimeSlot)=> {
        return availableTimeSlot.selected = false;
    })

    const bookedTime = convertObjectIntoArray(selectedDates);

    // // loop over selected time slots
    // bookedTime.map((selectedTimeSlot)=> {
    //     // loop over available time slots and add selected flag if within the range of booked time slots 
    //     return availableTimeSlots.map((availableTimeSlot)=> {
    //         if(availableTimeSlot.start_time >= selectedTimeSlot.start_time && availableTimeSlot.start_time < selectedTimeSlot.end_time ){
    //             console.log(new Date(availableTimeSlot.start_time).getDay())
    //             return availableTimeSlot.selected = true;
    //         }
    //         return availableTimeSlot.selected = false;
    //     })
    // })

    // loop over available time slots and add selected flag if within the range of booked time slots 
    availableTimeSlots.map((availableTimeSlot)=> {
        return bookedTime.map((selectedTimeSlot)=> {
    console.log('selectedTimeSlot', selectedTimeSlot)
            // eslint-disable-next-line
            if(availableTimeSlot.start_time >= selectedTimeSlot.start_time && availableTimeSlot.start_time < selectedTimeSlot.end_time || 
                (availableTimeSlot.end_time>selectedTimeSlot.start_time && availableTimeSlot.end_time <selectedTimeSlot.end_time) ){
                console.log(new Date(availableTimeSlot.start_time).getDay())
                return availableTimeSlot.selected = true;
            }
            return availableTimeSlot.selected = false;
        })
    })
    

    return groupByDay(availableTimeSlots);
}

function convertObjectIntoArray(object: groupedDates): SelectedDates[]{

    const SelectedDatesArray: SelectedDates[] = [];
    Object.keys(object).map((x)=> {
        return SelectedDatesArray.push(...object[x])
    })    

    return SelectedDatesArray;

}