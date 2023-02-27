import { DelimiterParser, SerialPort } from 'serialport';
import { parse } from './parseData.js';

// let portName = "COM5";
let portName = "/dev/ttyUSB0";


const port = new SerialPort({ path: portName, baudRate: 9600 });

const delimiterParserInstance = new DelimiterParser({ delimiter: Buffer.from([0xff]) });

delimiterParserInstance.addListener("data", async (...args) => {
    try {
        const asd = parse(...args)
        console.log(asd);

        const body = JSON.stringify(asd);
        const request = await fetch(
            'http://localhost:3000',
            {
                body,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const response = await request.json();
        // console.log("response: ", response);

    } catch (err) {
        console.log(err)
    }
});

port.pipe(delimiterParserInstance)

