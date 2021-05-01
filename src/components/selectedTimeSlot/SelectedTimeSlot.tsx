import { TimeSlotData } from 'interfaces/response';
import * as React from 'react';

interface SelectedTimeSlotProps{
    selectedTimeSlot: TimeSlotData[];
}

interface SelectedTimeSlotState{
    selectedTimeSlot: TimeSlotData[];
}


export class SelectedTimeSlot extends React.Component<SelectedTimeSlotProps, SelectedTimeSlotState> {

    constructor(props: SelectedTimeSlotProps){
        super(props);
        this.state= {
            selectedTimeSlot: this.props.selectedTimeSlot
        }

        this.onChange= this.onChange.bind(this);
    }

    render(){
        return (
            <div className="selected-time-slot"> 

            </div> 
           
        );
    }

    public onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void{
      //  this.setState({inputText: event.target.value, error: false, showOutput: false})
    }

}


