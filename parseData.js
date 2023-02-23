export function parse(binaryPacket) {
  if (binaryPacket.length !== 10)
    throw new Error(`UNRECOGNIZED: ${binaryPacket}`);

  const binaryPacketStringView = binaryPacket.toString('hex');

  let sensorCode = parseInt(binaryPacketStringView.slice(10, 12), 16);

  const sensorCodeToSensorNameAndCoefficient = {
    0x14: ['O2', 1 / 1000], // значение в натуральной десятичной дроби (показывает датчик в процентах то есть * 100)
    0x13: ['DO', 1 / 100],
    0x0d: ['pH', 1 / 100],
    0x10: ['ORP', 1 / 10],
    0x01: ['Cond', 1 / 10],
    0x05: ['TDS', 1 / 10],
    0x09: ['Salt', 1 / 10],
  }

  if (!(sensorCode in sensorCodeToSensorNameAndCoefficient))
    throw new Error(`UNRECOGNIZED: ${binaryPacket}`);

  const [sensorCodeName, correctionCoefficient] =
    sensorCodeToSensorNameAndCoefficient[sensorCode];

  const valueOfTempSensor = parseInt(binaryPacketStringView.slice(7, 11), 10) / 100;

  const optionalSensorValue = parseInt(binaryPacketStringView.slice(2, 6), 10) * correctionCoefficient;

  console.log(`${sensorCodeName} value: `, sensorValue);
  const date = new Date();

  return {
    sensorMeasurements: [
      {
        sensorCodeName: "Temp",
        value: valueOfTempSensor,
        date,
      },
      {
        sensorCodeName,
        value: optionalSensorValue,
        date,
      },
    ],
  }
}
