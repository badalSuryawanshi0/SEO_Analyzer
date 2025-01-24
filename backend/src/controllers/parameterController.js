import {
  createParameter,
  getParameteres,
  updateParameters,
} from "../services/actions.js";
import { z } from "zod";
import { parameterSchema, parameterUpdateSchema } from "../utils/types.js";
export const createParam = async (req, res) => {
  try {
    const parsedParameter = parameterSchema.parse(req.body);
    const parameter = await createParameter(parsedParameter);
    if (parameter) {
      return res.status(200).json({
        message: "Parameter created successfully",
        parameter,
      });
    }
    return res.status(200).json({
      message: "Error creating parameter",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};
//get paramerts array
//update parameter array in db

export const getUpdatedParameters = async (req, res) => {
  try {
    const parameters = req.body;
    console.log("Parameters to be updated log", parameters);

    const updatedParameters = await updateParameters(parameters);

    res.status(200).json({
      message: "Parameters updated successfully !",
      updatedParameters,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

// export const updateParam = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const inputData = parameterUpdateSchema.parse(req.body);
//     console.log(inputData);
//     const parameter = await updateParameter(id, inputData);
//     if (parameter) {
//       return res.status(200).json({
//         message: "Parameter Updated Successfully",
//         parameter,
//       });
//     }
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return res.status(400).json({
//         message: error.errors[0].message,
//       });
//     }
//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const getParams = async (req, res) => {
  try {
    const parameters = await getParameteres();
    return res.status(200).json(parameters);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
