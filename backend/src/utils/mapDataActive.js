export const mapDataToActiveParameter = (parameters, data) => {
  try {
    const result = {};
    parameters.forEach((parameter) => {
      const { field, name } = parameter;
      if (data.hasOwnProperty(field)) {
        result[name] = data[field];
      }
    });
    return result;
  } catch (error) {
    console.log("Error mapping data to active parameter");
    throw new Error("Error mapping data to active parameter");
  }
};
