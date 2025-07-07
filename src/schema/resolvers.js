import Employee from "../models/Employee.js";
import User     from "../models/User.js";
import bcrypt   from "bcrypt";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { generateToken } from "../utils/auth.js";

export const resolvers = {
  Query: {
    // List employees with pagination, sorting & optional name filter
    employees: async (
      _,
      { page = 1, limit = 20, sort, filter },
      context
    ) => {
      // only logged‐in users
      if (!context.user) {
        throw new AuthenticationError("Unauthorized");
      }

      // build Mongo filter
      const mongoFilter = {};
      if (filter) {
        mongoFilter.name = { $regex: filter, $options: "i" };
      }

      // compute skip & limit
      const skip = (page - 1) * limit;

      // build sort object
      const sortObj = {};
      if (sort) {
        const fieldMap = {
          NAME:       "name",
          AGE:        "age",
          CLASS:      "class",
          ATTENDANCE: "attendance",
        };
        const mongoField = fieldMap[sort.field];
        if (mongoField) {
          sortObj[mongoField] = sort.order === "ASC" ? 1 : -1;
        }
      }

      // fetch total & page items in parallel
      const [ totalItems, items ] = await Promise.all([
        Employee.countDocuments(mongoFilter),
        Employee.find(mongoFilter)
          .sort(sortObj)
          .skip(skip)
          .limit(limit),
      ]);

      const totalPages = Math.ceil(totalItems / limit);
      return {
        items,
        pageInfo: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    },

    // Fetch single employee by ID
    employee: async (_, { id }, context) => {
      if (!context.user) {
        throw new AuthenticationError("Unauthorized");
      }
      return Employee.findById(id);
    },

    // Current user
    me: (_, __, context) => {
      return context.user || null;
    },
  },

  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AuthenticationError("Invalid credentials");
      }
      const token = generateToken(user);
      return { ...user.toObject(), token };
    },

    addEmployee: async (_, { input }, context) => {
      if (context.user?.role !== "admin") {
        throw new ForbiddenError("Forbidden");
      }
      return Employee.create(input);
    },

    updateEmployee: async (_, { id, input }, context) => {
      if (context.user?.role !== "admin") {
        throw new ForbiddenError("Forbidden");
      }
      return Employee.findByIdAndUpdate(id, input, { new: true });
    },

    deleteEmployee: async (_, { id }, context) => {
      if (context.user?.role !== "admin") {
        throw new ForbiddenError("Forbidden");
      }
      await Employee.findByIdAndDelete(id);
      return true;
    },
  },
};
