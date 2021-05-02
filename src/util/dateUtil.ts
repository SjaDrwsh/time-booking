import { TimeSlotData } from "interfaces/response";

// the key would be the date and each object would contain the time slots available that day
export interface groupedDates {
    [key: string]: SelectedDates[]
}

// extending the data to contain selected flag for the UI handling
export interface SelectedDates extends TimeSlotData{
    selected?: boolean;
}

/**
 * groups the array of time slots into dates object and sorts the array of time
 * @param timeSlotsArray 
 * @returns groupedDates an object days containing an array of time slot for that day
 */
export function groupByDay(timeSlotsArray: SelectedDates[]): groupedDates{
    
    // creating a hash map of days as keys to group by day
    const daysObject: groupedDates = {};

    for (const iterator of timeSlotsArray) {
        const startDate = new Date(iterator.start_time);
         const date = startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate();
        console.log(startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate())
        // check if day deos not exists added it days object then push time slots
        if(!daysObject[date]){
            daysObject[date] = [];
        }
        daysObject[date].push({start_time: iterator.start_time, end_time: iterator.end_time, selected: iterator.selected});
    }
    
    // calling the sort function on every day of the week
    for (const key in daysObject) {
        daysObject[key] = sortDates(daysObject[key]);
    }

    return daysObject;
}

/**
 * sort array by start time end_time
 * @param dates to sort 
 * @returns a sorted array of type TimeSlotData
 */
export function sortDates(dates: TimeSlotData[]): TimeSlotData[]{
    return dates.sort(function(a, b) {
        return (a.end_time < b.end_time) ? -1 : ((a.end_time > b.end_time) ? 1 : 0);
    });
} 

/**
 * converts ISO format time to human readable time to display on UI
 * @param date 
 * @returns formatted date
 */
export function convertDateToReadableFormat(date: string): string{
    const newDate = new Date(date);
    return `${newDate.getHours()}:${newDate.getMinutes()}`;
}

/**
 * adding flag selected to time, so only allow one company per time slot
 * @param availableTimeSlots 
 * @param selectedDates 
 * @returns grouped and sorted array
 */
export function mapSelectedTimeSlots(availableTimeSlots: SelectedDates[], selectedDates: groupedDates | undefined): groupedDates{
    if (!selectedDates || Object.keys(selectedDates).length === 0){
        return groupByDay(availableTimeSlots);
    }

    const bookedTimeSlots = convertObjectIntoArray(selectedDates); 
 
    for (const availableTimeSlot of availableTimeSlots) {
        for (const selectedTimeSlot of bookedTimeSlots) {
            // eslint-disable-next-line
            if((availableTimeSlot.start_time >= selectedTimeSlot.start_time && availableTimeSlot.start_time < selectedTimeSlot.end_time || 
                (availableTimeSlot.end_time>selectedTimeSlot.start_time && availableTimeSlot.end_time <selectedTimeSlot.end_time) )){
                availableTimeSlot.selected = true;
                continue;
            } 
            availableTimeSlot.selected = false;
        }   
    }
    
    return groupByDay(availableTimeSlots);
}

function convertObjectIntoArray(object: groupedDates): SelectedDates[]{

    const SelectedDatesArray: SelectedDates[] = [];
    Object.keys(object).map((x)=> {
        return SelectedDatesArray.push(...object[x])
    })    

    return SelectedDatesArray;
}