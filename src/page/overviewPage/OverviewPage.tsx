import { TimeSlotList } from 'components/timeSlotList/TimeSlotList';
import { TimeSlotData, TimeSlotResponse } from 'interfaces/response';
import * as React from 'react';
import { Grid, SemanticWIDTHS } from 'semantic-ui-react';
import { timeSlotApiService } from 'service/timeSlot/TimeSlotApiService';
import { ReadApiStateContext } from 'state/ReadApiStateContext';

interface OverviewPageState {
    /** the key would be the company`s id this why its dynamic
     * it contains an array of data
     */
    [key:string]: TimeSlotData[];
}

interface OverviewPageProps {}

export class OverviewPage extends React.Component<OverviewPageProps, OverviewPageState> {

    constructor(props: OverviewPageProps){
        super(props);

        this.state= {}
    }

    /** fetching the data from server on mount */
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
                                    <TimeSlotList 
                                        availableTimeSlot={!!this.state[company.id]? this.state[company.id]: []} 
                                        header="Booked Times" 
                                        isSelectable={false} 
                                        isDeletable
                                        onChange={(time: TimeSlotData)=>{
                                            // I wanted to implement delete functionality but did not have time
                                            // remove selected time slot from booked slots
                                            this.setState({[company.id] : [] });
                                            
                                        }}
                                        />
                                </Grid.Column>
                            ))}

                            {data.map((company,i)=>(
                                <Grid.Column key={`${company}-${i}`}>
                                    <TimeSlotList 
                                        availableTimeSlot={company.time_slots} 
                                        header="Available Times" 
                                        isSelectable 
                                        isDeletable={false}
                                        selectedItems={this.state}
                                        onChange={(times: TimeSlotData)=>{
                                            // add selected time slot to booked slots
                                            // only allow one reservation per company at once
                                            this.setState({[company.id]: [times]})
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