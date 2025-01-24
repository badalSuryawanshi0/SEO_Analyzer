export const mapDataToParameter = (parameter, data) => {
  const reportData = {};
  parameter.forEach((parameter) => {
    const { field } = parameter;
    if (data[field] !== undefined) {   //maps data to its respective field if available
      reportData[field] = data[field];
    }
  });
  console.log("Map data", reportData);
  return reportData;
};
