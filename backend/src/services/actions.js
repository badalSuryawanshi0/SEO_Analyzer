import { PrismaClient } from "@prisma/client";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { AdminSchema } from "../utils/types.js";
const Secret = process.env.SECRET;
const prisma = new PrismaClient();

export async function createAdmin(adminInput) {
  try {
    const { email, password } = AdminSchema.parse(adminInput);
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      throw new Error("A user with that email address already exists");
    }
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: true,
      },
    });

    return admin;
  } catch (error) {
    console.log("Error creating user", error);
    throw new Error("Signup Error");
  }
}
export async function existingUser(adminInput) {
  try {
    const { email, password } = AdminSchema.parse(adminInput);
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!existingUser) {
      throw new Error(
        "This email address is not associated with any existing account."
      );
    }
    const validatePassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!validatePassword) {
      throw new Error("Incorrect password. Please try again");
    }
    const token = jwt.sign(
      {
        id: existingUser.id,
        isAdmin: existingUser.isAdmin,
      },
      Secret
    );
    return token;
  } catch (error) {
    console.log("Error validating existing user", error);
    throw new Error("SignIn Error ");
  }
}
export async function createAnonymousUser() {
  try {
    const user = await prisma.user.create({
      data: {
        isAdmin: false,
      },
    });
    return user;
  } catch (error) {
    console.log("Error creating user", error);
    throw new Error("Error creating user");
  }
}
export async function getUser(id) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log("Error fetching user (CookieId)");
    throw new Error("Errro Fecthing User");
  }
}
export async function createParameter(paramInput) {
  try {
    const { name, type, field } = paramInput;
    const existingParam = await prisma.parameter.findFirst({
      where: {
        OR: [{ name: name }, { field: field }],
      },
    });
    if (existingParam) {
      throw new Error("A parameter with this name or field already exists");
    }

    const param = await prisma.parameter.create({
      data: {
        name: name,
        type: type,
        field: field,
      },
    });
    return param;
  } catch (error) {
    console.log("Error creating parameter", error);
    throw new Error("Error creating parameter", error);
  }
}
export async function getParameterById(id) {
  try {
    const existingParameter = await prisma.parameter.findUnique({
      where: {
        id,
      },
    });

    return existingParameter;
  } catch (error) {
    console.log("Error fetching parameter by id", error);
    throw new Error("Error fetching parameter");
  }
}
export async function updateParameters(inputData) {
  console.log("Actions/updateParameters before", inputData);
  const updates = await Promise.all(
    inputData.map(async (parameter) => {
      const existingParameter = await getParameterById(parameter.id);
      if (!existingParameter) {
        throw new Error("Parameter does not exits");
      }
      // name which is taken
      if (parameter.name) {
        const duplicateParameter = await prisma.parameter.findFirst({
          where: {
            name: parameter.name,
            NOT: { id: parameter.id },
          },
        });
        if (duplicateParameter) {
          throw new Error("The name is already taken by parameter");
        }
      }
      //with same name
      // if (parameter.name && parameter.name === existingParameter.name) {
      //return existing paramater
      //   console.log("You're sending same name again and again");
      //   return existingParameter;
      // }
      const update = await prisma.parameter.update({
        where: {
          id: parameter.id,
        },
        data: {
          name: parameter.name,
          isActive: parameter.isActive,
        },
      });
      console.log("parameter record updated:", update);
      return update;
    })
  );
  console.log("Action/getUpdatedParameter", updates);
  return updates;
}
// const updatebleFields = ["name", "description"];
// const fieldsToUpdate = Object.keys(paramInput)
//   .filter((keys) => updatebleFields.includes(keys))
//   .reduce((obj, keys) => {
//     obj[keys] = paramInput[keys];
//     return obj;
//   }, {});
//validate the unique name (If provided)
// if (fieldsToUpdate.name == existingParam.name) {
//   throw new Error("Name must be unique");
// }

//get all Parameter
export async function getParameteres() {
  try {
    const parameteres = await prisma.parameter.findMany({});
    return parameteres;
  } catch (error) {
    console.log("Error fetching parameter", error);
    throw new Error("Error fetching Parameters");
  }
}
export async function addUserUrl(user, url) {
  try {
    const Url = await prisma.url.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        url,
      },
    });
    return Url;
  } catch (error) {
    console.log("Error Adding url to user", error);
    throw new Error("Error Connecting url to user");
  }
}
//Save report
export async function saveReport(id, data) {
  try {
    console.log("logging id from saveReport function", id);
    const report = await prisma.report.create({
      data: {
        data,
        url: {
          connect: {
            id: id,
          },
        },
      },
    });
    return report;
  } catch (error) {
    console.error("Error saving report", error);
    throw new Error("Error saving report");
  }
}
//Get all active parameter
export async function getActiveParameters() {
  try {
    const parameter = await prisma.parameter.findMany({
      where: {
        isActive: true,
      },
    });
    console.log("Active parameter", parameter);
    return parameter;
  } catch (error) {
    console.log("Error fetching Activeparameters", error);
    throw new Error("Error fetching Active Parameter");
  }
}
//Check existing Url
//But the fetched date should not be more than 3 days ago
export async function checkUrlExits(url) {
  try {
    const Url = await prisma.url.findFirst({
      where: { url },
      include: {
        report: true,
        suggestion: true,
      },
    });
    return {
      report: Url?.report,
      suggestion: Url?.suggestion,
    };
  } catch (error) {
    console.log("Error fetching url", error);
    throw new Error("Error fetching existing Url report and suggestion");
  }
}
export async function addSuggestionTOUrl(id, dataInput) {
  try {
    const suggestions = await prisma.suggestion.create({
      data: {
        data: dataInput,
        url: {
          connect: {
            id,
          },
        },
      },
    });
    return suggestions.data;
  } catch (error) {
    console.log("Error while adding suggestion to url", error);
    throw new Error("Error Saving Suggestions");
  }
}

// export async function deleteParameter(id) {
//   const existingParam = await getParameterById(id);
//   if (!existingParam) {
//     throw new Error("Parameter not found");
//   }
//   const deleteParam = await prisma.parameters.delete({
//     where: {
//       id,
//     },
//   });
//   if (!deleteParam) {
//     throw new Error("Error deleting parameter");
//   }
//   return deleteParam;
// }
// export async function getParameteres() {
//   const parameteres = await prisma.parameters.findMany();
//   if (!parameteres) {
//     throw new Error("Error fetching the parameteres");
//   }
//   return parameteres;
// }
