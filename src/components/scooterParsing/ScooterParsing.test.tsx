import { ScooterParsing, ScooterPayloadErrorInput, ScooterPayloadInput } from './ScooterParsing';

describe('test ScooterParsing functions', ()=> {
  const scooterParsing = new ScooterParsing({});
  const mockData = ' +IN,DeviceInfo,860861040012976,86,5600,2021-01-14T15:05:10,0035$ AABBAA +IN,DeviceInfo,860861040012975,34,5612,2021-01-14T18:30:10,0036$ CCDDEE +IN,DeviceInfo,860861040012974,3,5623,2021-01-14T23:59:10,0037$ FFGGHH ';

  describe('test validateInput function', () => {

    /** removed battery information */
    const mockWrongData = ' +IN,DeviceInfo,860861040012976,86,5600,2021-01-14T15:05:10,0035$ AABBAA +IN,DeviceInfo,860861040012975,5612,2021-01-14T18:30:10,0036$ CCDDEE +IN,DeviceInfo,860861040012974,3,5623,2021-01-14T23:59:10,0037$ FFGGHH '

    test('should return true if all input is valid', () => {
      const result = scooterParsing.validateInput(mockData);
      expect(result).toEqual(true);
    });

    test('should return false if input is NOT valid', () => {
      const result = scooterParsing.validateInput(mockWrongData);
      expect(result).toEqual(false);
    });
  });

  describe('test separateEveryPacket function', () => {
    test('should return an array of every packet row', () => {
      const result = scooterParsing.separateEveryPacket(mockData);

      expect(result[0]).toEqual('IN,DeviceInfo,860861040012976,86,5600,2021-01-14T15:05:10,0035$ AABBAA');
      expect(result[1]).toEqual('IN,DeviceInfo,860861040012975,34,5612,2021-01-14T18:30:10,0036$ CCDDEE');
      expect(result[2]).toEqual('IN,DeviceInfo,860861040012974,3,5623,2021-01-14T23:59:10,0037$ FFGGHH');
    });
  });

  describe('test separatePacketInformation function', () => {
    test('should return an array of packet information of single row from payload stream until $', () => {
      const mockPayloadRowData = 'IN,DeviceInfo,860861040012976,86,5600,2021-01-14T15:05:10,0035$ AABBAA'
      const result = scooterParsing.separatePacketInformation(mockPayloadRowData);

      expect(result[0]).toEqual('IN');
      expect(result[1]).toEqual('DeviceInfo');
      expect(result[2]).toEqual('860861040012976');
      expect(result[3]).toEqual('86');
      expect(result[4]).toEqual('5600');
      expect(result[5]).toEqual('2021-01-14T15:05:10');
      expect(result[6]).toEqual('0035$');
    });
  });

  describe('test packetObjectForming function', () => {
    test('should return an object of scooter normal packet information', () => {
      const mockPayloadData = '+IN,DeviceInfo,860861040012976,86,5600,2021-01-14T15:05:10,0035$ AABBAA';
      const result: (ScooterPayloadInput | ScooterPayloadErrorInput)[] = scooterParsing.packetObjectForming(mockPayloadData);

      expect(result[0].imei).toEqual('860861040012976');
      expect(result[0].batteryLevel).toEqual('86 %');
      expect(result[0].odometer).toEqual('5600 km');
      expect(result[0].time).toEqual(new Date('2021-01-14T15:05:10').toISOString());
    });

    test('should return an object of scooter error packet information', () => {
      const mockPayloadData = '+IN,Error,860861040012977,2,5,NoBattery,7,ECUFailure,2021-01-14T15:06:18,0036$';
      const result = scooterParsing.packetObjectForming(mockPayloadData) as ScooterPayloadErrorInput[];

      expect(result[0].imei).toEqual('860861040012977');
      expect(result[0].time).toEqual(new Date('2021-01-14T15:06:18').toISOString());
      expect(result[0]['NoBattery']).toEqual("5");
      expect(result[0]['ECUFailure']).toEqual("7");
    });
  });

  describe('test formErrorPacketObject function', () => {
    test('should return an object of scooter error packet information', () => {
      const mockPayloadData = '+IN,Error,860861040012977,2,5,NoBattery,7,ECUFailure,2021-01-14T15:06:18,0036$';
      const result = scooterParsing.formErrorPacketObject(mockPayloadData) as ScooterPayloadErrorInput;

      expect(result.imei).toEqual('860861040012977');
      expect(result.time).toEqual(new Date('2021-01-14T15:06:18').toISOString());
      expect(result['NoBattery']).toEqual("5");
      expect(result['ECUFailure']).toEqual("7");
    });
  });

  describe('test formNormalPacketObject function', () => {
    test('should return an object of scooter normal packet information', () => {
      const mockPayloadData = '+IN,DeviceInfo,860861040012976,86,5600,2021-01-14T15:05:10,0035$ AABBAA';
      const result: (ScooterPayloadInput | ScooterPayloadErrorInput) = scooterParsing.formNormalPacketObject(mockPayloadData);

      expect(result.imei).toEqual('860861040012976');
      expect(result.batteryLevel).toEqual('86 %');
      expect(result.odometer).toEqual('5600 km');
      expect(result.time).toEqual(new Date('2021-01-14T15:05:10').toISOString());
    });
  });
})

