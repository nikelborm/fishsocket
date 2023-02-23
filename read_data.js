import { DelimiterParser, SerialPort } from 'serialport';
import { parse } from './parseData.js';

// let portName = "COM5";
let portName = "/dev/ttyUSB0";


const port = new SerialPort({ path: portName, baudRate: 9600 });

const delimiterParserInstance = new DelimiterParser({ delimiter: Buffer.from([0xff]) });

delimiterParserInstance.addListener( "data", parse );

port.pipe(delimiterParserInstance)
