const {SerialPort} = require("serialport");
const struct = require("python-struct");
const datetime = require('date-and-time');
const {DelimiterParser} = require('@serialport/parser-delimiter');
const format = require("python-format-js");
const path = require("path");
const strftime = require('strftime');
const { readlineParser } = require('@serialport/parser-readline');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');
const hex = require("to-hex")



let portName = "COM5";
let TIMEOUT = 60;

function convert(v) {
    return parseFloat(hex(v).slice(2));
};

function stime(dt) {
    return date.format(dt, "%Y-%m-%d-%H-%M-%S");
}

const port = new SerialPort({path: portName, baudRate: 9600});
// const parser = new InterByteTimeoutParser({interval: 10})
// const sensor_data = new port.pipe(parser);
const delimeterParserInstance = new DelimiterParser({ delimiter: Buffer.from([0xff])});
// UNRECOGNIZED: <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// UNRECOGNIZED: <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// UNRECOGNIZED: <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// UNRECOGNIZED: <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// <Buffer 00 01 84 02 25 12 00 0f fd 0f>
// UNRECOGNIZED: <Buffer 00 01 84 02 25 12 00 0f fd 0f>
delimeterParserInstance.addListener( "data", async(b) => {
    console.log(b);
    if (b.length !== 11) return console.log('UNRECOGNIZED:', b);
    
    console.log(
        b, b[1], b[2], b[3], b[4], b[5]. b[6],
        struct.unpack('h', b.slice(1, 3))[0],
        struct.unpack('h', b.slice(2, 4))[0], 
        struct.unpack('h', b.slice(4, 6))[0], 
        struct.unpack('h', b.slice(5, 7))[0], 
    )

    let Val = convert(b[1]);
    Val += convert(b[2])/100.0;

    let Tf = convert(b[4] && 0b00001111);
    let Tn = convert(b[4] && 0b11110000);
    let Td = convert(b[3]);
    let Temp = Td * 10.0 + Tn / 10.0 + Tf / 10.0;

    let mode = b[5];
    let mode_str = 'None';
    if (mode == 20) {
        mode_str = 'O2';
        Val += 10.0;
    }
    else if (mode == 18) {
        mode_str = 'DO';
    }
    else if (mode == 13) {
        mode_str = 'pH';
    }
    else if (mode == 49) {
        mode_str = 'ORP';
    }
    else if (mode == 1) {
        mode_str = 'Cond';
    }
    else if (mode == 5) {
        mode_str = 'TDS';
    }
    else if (mode == 9) {
        mode_str = 'Salt';
    }
    else if (mode == 2) {
        mode_str = 'Wait';
    }

    console.log('t:', Temp, mode_str + ':', Val + '{0:08b}'.format(b[4]));//спросить у вовы про 0,08b
    let time = stime(Date());
    console.log(time, Temp, mode_str, Val);
//             return [time, Temp, mode_str, Val];
});
port.pipe(delimeterParserInstance)