import { parse } from './parseData.js';

//o2
const binaryPacket = Buffer.from([
    0x00,0x02,0x28,0x02,0x25,0x14,0x00,0x0f,0xfd,0x0f
])

console.log('parseData(binaryPacket): ', parse(binaryPacket));
