import { AvailableTimeSlot } from 'components/availableTimeSlot/AvailableTimeSlot';
import { SelectedTimeSlot } from 'components/selectedTimeSlot/SelectedTimeSlot';
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
                            {
                                data.map((company,i)=>(
                                    <Grid.Column key={`${company}-${i}`}>
                                        <div className="box">{company.name}</div>
                                        <SelectedTimeSlot selectedTimeSlot={!!this.state[company.name]? this.state[company.name]: []}></SelectedTimeSlot>
                                        <AvailableTimeSlot availableTimeSlot={company.time_slots}></AvailableTimeSlot>
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