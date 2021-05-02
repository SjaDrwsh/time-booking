import { TimeSlotData } from 'interfaces/response';
import * as React from 'react';
import { Grid, Icon, Segment } from 'semantic-ui-react';
import { convertDateToReadableFormat, groupByDay, groupedDates } from 'util/dateUtil';

interface AvailableTimeSlotProps{
    availableTimeSlot: TimeSlotData[];
    header: string;
    isSelectable: boolean;
    isDeletable: boolean;
    onChange: (selectedTime: TimeSlotData) => void
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

        this.onClick= this.onClick.bind(this);
    }

    render(){
        const { header, isSelectable, isDeletable, availableTimeSlot } = this.props;
        const dates: groupedDates = groupByDay(availableTimeSlot);     

        return (
            <div className="select-time-slot"> 
            <h5>{header}</h5>
                <Segment.Group>
                    {
                        Object.keys(dates).map((element, i) => {
                            return( 
                                <Segment key={`${element}-${i}-segment`} >
                                        <p>{element}</p>
                                    <Grid.Column key={`${element}-${i}`}>
                                       {dates[element].map((time: TimeSlotData, i)=>(
                                            <Grid.Row key={`${time}-${i}-row`}>
                                                <Segment 
                                                    key={`${time}-${i}-segment`} 
                                                    onClick={()=> (
                                                        isSelectable? this.onClick(time) : {}
                                                        
                                                    )}>
                                                    {isDeletable && (
                                                        <Icon name='delete' onClick={(e: any)=>{this.onClick(e)}}></Icon>
                                                    )}
                                                    <p key={`${time}-${i}-p`} >{convertDateToReadableFormat(time.start_time)} - {convertDateToReadableFormat(time.end_time)}</p>
                                                </Segment>
                                            </Grid.Row>
                                        )) 
                                        }  
                                    </Grid.Column>
                                </Segment>
                            )
                        })
                    }
                                                      
                </Segment.Group>
            </div> 
           
        );
    }

    public onClick(time: TimeSlotData): void{
      //  this.setState({inputText: event.target.value, error: false, showOutput: false})
      this.props.onChange(time)
    }
}


