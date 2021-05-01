import * as React from 'react';

export interface MainScooterPayloadInput {
    imei: string;
    time: string;
}

/** interface for the Normal Packet */
export interface ScooterPayloadInput extends MainScooterPayloadInput {
    batteryLevel: string;
    odometer: string;
}

/** interface for the Error Packet */
export interface ScooterPayloadErrorInput extends MainScooterPayloadInput{
    /** dynamic key depending on the error */
    [key: string]: string;
}

export interface ScooterParsingIState{
    inputText: string;
    error: boolean;
    output: (ScooterPayloadInput | ScooterPayloadErrorInput)[];
    showOutput: boolean;
}

export interface ScooterParsingIProps{}

// regex for all normal data stream of packet
// 0 Type 2-3 IN / OUT
export const inOutRegex = `(IN|OUT)`;
// 1 Instruction <= 20 DeviceInfo / PositionUpdate / etc.
export const instructionRegex = `[ A-Za-z]{0,20}`;
// 2 Unique ID 15 IMEI
export const idRegex = `[0-9]{15}`;
// 3 BatteryLevel 1-3  0-100
export const batteryLevelRegex = `([0-9]|[1-9][0-9]|100)`;
// 4 Odometer <=6  0-999999
export const OdometerRegex = `[0-9]{1,6}`;
// 5 Time 19 ISO date 'YYYY-MM-DDTHHMMSS'
export const timeRegex = `[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}`;
// 6 Count Number 4 0000 - FFFF , End of Packet Tail Character 1 $\n
export const countNumberRegex = `[0-9a-fA-F]{1,4}\\$`;
// 1 - 9, describes how many Error Tuples 
export const totalNumberOfErrors = `[0-9]`;
// 1 - 9, describes how many Error Tuples (Error Code* + Error Description*) within that packet exist.
export const errorCodeAndDescriptionRegex = `[0-9],[a-zA-Z]{0,20},`

// regex for error data stream of packet
export const errorRegex = `${inOutRegex},(Error),${idRegex},${totalNumberOfErrors},`; 
export const nonErrorRegex = `${inOutRegex},${instructionRegex},${idRegex},`; 

export class ScooterParsing extends React.Component<ScooterParsingIProps, ScooterParsingIState> {

    constructor(props: ScooterParsingIProps){
        super(props);
        this.state= {
            inputText: '',
            error: false,
            output: [],
            showOutput: false,
        }

        this.onChange= this.onChange.bind(this);
    }

    render(){
        return (
            <div className="scooter-parsing"> 
                <h3>Scooter Parsing (PART I + PART II)</h3>
                <p> This section contains two input examples to run the sample click the copy button next to the input sample and add in input text area and press run
                    <br/><small><i>you can also test any other input</i></small></p>
                <p><b>Output: </b></p>
                <p> The out put appears as an object in the output box</p>       

                <div className="solution-area">
                    <h4>Input Samples</h4>
                    <small><i>Without errors</i></small>
                    <div className="sample-area"> 
                        <p>
                            '
                                +IN,DeviceInfo,860861040012976,86,5600,2021-01-14T15:05:10,0035$
                                AABBAA
                                +IN,DeviceInfo,860861040012975,34,5612,2021-01-14T18:30:10,0036$
                                CCDDEE
                                +IN,DeviceInfo,860861040012974,3,5623,2021-01-14T23:59:10,0037$
                                FFGGHH
                            '
                        </p>
                    </div>
                    <small><i>With errors</i></small>
                    <div className="sample-area"> 
                        <p>
                            '
                                +IN,DeviceInfo,860861040012977,86,5600,2021-01-14T15:05:10,0035$
                                AABBAA
                                +IN,Error,860861040012977,2,5,NoBattery,7,ECUFailure,2021-01-14T15:06:18,0036$
                                +IN,Error,860861040012977,1,7,ECUFailure,2021-01-14T15:09:18,0037$
                                +IN,DeviceInfo,860861040012977,34,5612,2021-01-14T18:30:10,0038$
                                CCDDEE
                                +IN,Error,860861040012977,4,5,NoBattery,7,ECUFailure,8,Reboot,9,IotError,
                                2021-01-14T19:05:10,0039$
                                +IN,DeviceInfo,860861040012977,3,5623,2021-01-14T23:59:10,0040$
                                FFGGHH
                            '
                        </p>
                    </div>

                    <h4>Input Area</h4>
                    <p className="error" hidden={!this.state.error}> The input is invalid</p>
                    <textarea onChange={this.onChange}/>
                    <button className="gg-play-button" 
                    onClick={()=> {
                        this.getDeviceInformation(this.state.inputText);
                    }}
                    >Run Sample</button>

                    
                    <div className="output" hidden={!this.state.showOutput}>
                    <h4>Output Area</h4>
                        <div > 
                            {this.state.output.map((output,i)=>{
                                return <p key={i}>{JSON.stringify(output)}</p>
                            })}
                        </div>
                    </div>
                </div>
            </div> 
           
        );
    }

    public onChange(event: React.ChangeEvent<HTMLTextAreaElement>): void{
        this.setState({inputText: event.target.value, error: false, showOutput: false})
    }

    /**
     * read device information
     * @param input payload stream
     */
    public getDeviceInformation(input: string): void | undefined {
        // validate input 
        const validInput = this.validateInput(input.trim());
        if(!validInput){
            this.setState({error: true});
            return;         
        } else {           
            const outputArray = this.packetObjectForming(input);
            this.setState({output: outputArray , showOutput: true});   
        }
        
        // scroll to page bottom
        setTimeout(() => {
            window.scroll(0, window.innerHeight)
        }, 500);
    }

    /**
     * return true if valid
     * @param input input to validate
     */
    public validateInput(input: string): boolean{
        // put all in array to use later
        const normalPacketRegex = [inOutRegex,instructionRegex, idRegex, batteryLevelRegex, OdometerRegex, timeRegex, countNumberRegex];

        // remove first and last Character if they are (')
        input = input.replace(/'/ig, '').trim();

        // Begin of Packet Command 1 +
        if(input[0] === '+'){
            let packets: string[] = this.separateEveryPacket(input);
        
            // separate each packet     
            for (const iterator of packets) {
                // to make sure no spaces
                if(iterator === undefined){
                    return false;
                }

                if(iterator.match(errorRegex)){
                    const separatePacketInformation = this.separatePacketInformation(iterator);
                    const numberOfErrors = parseInt(separatePacketInformation[3]);
                    // here separate and join to make sure no spaces
                    if (!separatePacketInformation.join(',').match(`${errorRegex}${errorCodeAndDescriptionRegex.repeat(numberOfErrors)}${timeRegex}`)){
                        return false;
                    }
                    continue;
                }
    
                // match with given nonErrorRegex to make sure all data is there
                if(iterator.match(nonErrorRegex)){
                    // based on the rules given; total length of packet should be between (43 - 72)
                    if((iterator.length < 43) && !(iterator.length > 72)) return false;                

                    if (!iterator.match(normalPacketRegex.join())){
                        return false;
                    }
                }
            } 
        }else {
            return false;
        }

        return true;
    }

    /**
     * return separated packets
     * @param input payload stream to separate
     */
    public separateEveryPacket(input: string): string[] {   
        // Begin of Packet Command 1 +
        // because it begins with + must remove first element it will be empty
        // map with trim just to make sure no spaces
        const packets: string[]= input.split('+').splice(1,input.length-1).map((x)=>{
            return x.trim();
        });

        return packets;
    }

    /**
     * return separated packets information
     * @param input payload stream to separate
     */
    public separatePacketInformation(input: string): string[] {  
        // End of Packet Tail Character 1 $\n and remove spaces
        const packetInformation: string[] = input.substring(0,input.indexOf('$')+1).split(',').map(function(item) {
            return item.trim();
          });
        return packetInformation;        
    }

    /**
     * method for returning object array
     * @param input payload stream to check for error
     */
    public packetObjectForming(input: string) :  (ScooterPayloadInput|ScooterPayloadErrorInput)[] {

        const outputArray: (ScooterPayloadInput|ScooterPayloadErrorInput)[] = [];

        // separate each packet 
        const packets: string[] = this.separateEveryPacket(input);

        for (const iterator of packets) {
            if(iterator.match(errorRegex)){
                outputArray.push(this.formErrorPacketObject(iterator));
                continue;
            }

            if(iterator.match(nonErrorRegex)){
                outputArray.push(this.formNormalPacketObject(iterator))
            }
        } 
        return outputArray;
    }

    /**
     * return object of error packet
     * @param input one row of error packet
     */
    public formErrorPacketObject(input: string): ScooterPayloadErrorInput{
        // separate each packet information
        const separatePacketInformation = this.separatePacketInformation(input);
        const numberOfErrors = parseInt(separatePacketInformation[3]);

        let errorObject: ScooterPayloadErrorInput = {
            imei: separatePacketInformation[2],
            time: new Date(separatePacketInformation[numberOfErrors*2+4].trim()).toISOString()
        }

        for (let i = 4; i <= numberOfErrors*2+3; i += 2) {
            errorObject[separatePacketInformation[i+1]] = separatePacketInformation[i]
        }

        return errorObject;   
    }

    /**
     * return object of packet
     * @param input one normal packet
     */
    public formNormalPacketObject(input: string): ScooterPayloadInput{
        // separate each packet information
        const separatePacketInformation = this.separatePacketInformation(input);
        return {
            imei: separatePacketInformation[2],
            batteryLevel: separatePacketInformation[3] + ' %',
            odometer: separatePacketInformation[4]+ ' km',
            time: new Date(separatePacketInformation[5]).toISOString()
        }
    }
}


