import { ScooterParsing } from 'components/scooterParsing/ScooterParsing';
import * as React from 'react';

export class OverviewPage extends React.Component<any> {

    render(): JSX.Element{
        return (
            <div className='overviewPage'>
                <h2>Assignment</h2>
                <hr></hr>
                <p> Hello fellow Coder</p>
                <p>
                    Thanks for your interest in my application!
                    The next two sections contain the solutions of the two given parts of the assignment and instructions of how to run
                </p>
                    <ul>
                        <li>Scooter parsing I</li>
                        <li>Scooter parsing I</li>
                    </ul>    

              <ScooterParsing></ScooterParsing>
                
            </div>
        );
    }
}