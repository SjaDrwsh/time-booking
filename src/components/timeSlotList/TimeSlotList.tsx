import { TimeSlotData } from 'interfaces/response';
import * as React from 'react';
import { Grid, Icon, Segment } from 'semantic-ui-react';
import { convertDateToReadableFormat, groupedDates, mapSelectedTimeSlots, SelectedDates } from 'util/dateUtil';

interface TimeSlotListProps{
    availableTimeSlot: TimeSlotData[];
    header: string;
    isSelectable: boolean;
    isDeletable: boolean;
    onChange: (selectedTime: TimeSlotData) => void;
    selectedItems?: groupedDates;
}

interface TimeSlotListState{
    selectedTimeSlot: TimeSlotData[];
}


export class TimeSlotList extends React.Component<TimeSlotListProps, TimeSlotListState> {

    constructor(props: TimeSlotListProps){
        super(props);
        this.state= {
            selectedTimeSlot: []
        }

        this.onClick= this.onClick.bind(this);
    }

    render(){

        const { header, isSelectable, isDeletable, availableTimeSlot, selectedItems} = this.props;

        const updatesDates = mapSelectedTimeSlots(availableTimeSlot, selectedItems);

        return (
            <div className="select-time-slot"> 
            <h5>{header}</h5>
                <Segment.Group>
                    {
                        Object.keys(updatesDates).map((element, i) => {
                            return( 
                                <Segment key={`${element}-segment`} >
                                        <p>{element}</p>
                                    <Grid.Column key={`${i}-grid`}>
                                       {updatesDates[element].map((time: SelectedDates, i)=>(
                                            <Grid.Row key={`${i}-row`}>
                                                <Segment 
                                                  className={time.selected? 'disabled' : ''}
                                                    key={`${i}-segment`} 
                                                    onClick={()=> (
                                                        isSelectable && !time.selected? this.onClick(time) : {}
                                                    )}>
                                                    {isDeletable && (
                                                        <Icon name='remove circle' onClick={(e: any)=>{this.onClick(time)}}></Icon>
                                                    )}
                                                    <p key={`${i}-p`} >{convertDateToReadableFormat(time.start_time)} - {convertDateToReadableFormat(time.end_time)}</p>
                                                </Segment>
                                            </Grid.Row>
                                        )) 
                                        }  
                                    </Grid.Column>
                                </Segment>
                            )
                        })
                    }
                    {Object.keys(updatesDates).length === 0 && (
                        <p> no selected or available time slot</p>
                    )}
                                                      
                </Segment.Group>
            </div> 
           
        );
    }

    public onClick(time: TimeSlotData): void{
      this.props.onChange(time)
    }
}


