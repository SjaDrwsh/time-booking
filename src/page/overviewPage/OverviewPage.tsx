import { AvailableTimeSlot } from 'components/availableTimeSlot/AvailableTimeSlot';
import { TimeSlotData, TimeSlotResponse } from 'interfaces/response';
import * as React from 'react';
import { Grid, SemanticWIDTHS } from 'semantic-ui-react';
import { timeSlotApiService } from 'service/timeSlot/TimeSlotApiService';
import { ReadApiStateContext } from 'state/ReadApiStateContext';

interface OverviewPageState {
    [key:string]: TimeSlotData[];
}

interface OverviewPageProps {}

export class OverviewPage extends React.Component<OverviewPageProps, OverviewPageState> {

    constructor(props: OverviewPageProps){
        super(props);

        this.state= {}
    }

    componentDidMount(){
        this.getData();
    }

    render(): JSX.Element{
        return (
            <div className='overviewPage'>             
                    <ReadApiStateContext state={timeSlotApiService.getTimeSlots}>
                    {(data: TimeSlotResponse[]) => (
                        <Grid>
                            <Grid.Row columns={data.length as SemanticWIDTHS}>
                            {data.map((company,i)=>(
                                <Grid.Column key={`${company}-${i}`}>
                                    <div className="box">{company.name}</div>

                                    <AvailableTimeSlot 
                                        availableTimeSlot={!!this.state[company.id]? this.state[company.id]: []} 
                                        header="Booked Times" 
                                        isSelectable={false} 
                                        isDeletable
                                        onChange={(time: TimeSlotData)=>{
                                            // remove selected time slot from booked slots
                                            const filteredTimes = this.state[company.id].filter(
                                                x=> x.start_time!==time.start_time && x.end_time !== time.end_time
                                                );
                                            this.setState({[company.id] : filteredTimes })
                                        }}
                                        />
                                </Grid.Column>
                            ))}

                            {data.map((company,i)=>(
                                <Grid.Column key={`${company}-${i}`}>
                                    <AvailableTimeSlot 
                                        availableTimeSlot={company.time_slots} 
                                        header="Available Times" 
                                        isSelectable 
                                        isDeletable={false}
                                        selectedItems={this.state}
                                        onChange={(times: TimeSlotData)=>{
                                            // add selected time slot to booked slots
                                            if(this.state[company.id]){
                                                this.setState({[company.id] : [...this.state[company.id], times]});
                                            }else {
                                                this.setState({[company.id]: [times]})
                                            }
                                        }}
                                        />
                                </Grid.Column>
                            ))
                            }
                            </Grid.Row>
                        </Grid>
                    )}
                    </ReadApiStateContext>
            </div>
        );
    }

    private getData(): void{
        timeSlotApiService.getTimeSlots.call();
    }

}