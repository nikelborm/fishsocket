(async function () {
    const body = JSON.stringify({
      sensorMeasurements: [
        {
          sensorCodeName: "Temp",
          value: "33",
          date: new Date(),
        },
        {
          sensorCodeName: "O2",
          value: "12",
          date: new Date(),
        },
      ],
    });
    const request = await fetch(
      "http://192.168.1.12/api/sensorMeasurement/createMany",
      {
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await request.json();
    console.log("response: ", response);
  })();