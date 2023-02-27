(async function () {
    const body = JSON.stringify({
      sensorMeasurements: [
        {
          sensorCodeName: "Temp",
          value: "33",
          date,
        },
        {
          sensorCodeName: "O2",
          value: "12",
          date: new Date(),
        },
      ],
    });
    const request = await fetch(
      {port:3000},
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