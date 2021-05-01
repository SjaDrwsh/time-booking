import { TimeSlotData } from 'interfaces/response';
import * as React from 'react';
import { Segment } from 'semantic-ui-react';

interface AvailableTimeSlotProps{
    availableTimeSlot: TimeSlotData[];
}

interface AvailableTimeSlotState{
    selectedTimeSlot: TimeSlotData[];
}


export class AvailableTimeSlot extends React.Component<AvailableTimeSlotProps, AvailableTimeSlotState> {

    constructor(props: AvailableTimeSlotProps){
        super(props);
        this.state= {
            selectedTimeSlot: []
        }

        this.onChange= this.onChange.bind(this);
    }

    render(){
        return (
            <div className="select-time-slot"> 
            <h5>Booked Times</h5>
                <Segment.Group>
                    <Segment>
                    <p>Top</p>
                    </Segment>
                    <Segment.Group>
                        <Segment>
                            <p>Nested Top</p>
                        </Segment>
                        <Segment>
                            <p>Nested Middle</p>
                        </Segment>
                        <Segment>
                            <p>Nested Bottom</p>
                        </Segment>
                    </Segment.Group> 
                </Segment.Group>
            </div> 
           
        );
    }

    public onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void{
      //  this.setState({inputText: event.target.value, error: false, showOutput: false})
    }

}


