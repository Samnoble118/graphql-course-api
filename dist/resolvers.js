"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const resolvers = {
    Query: {
        courses: (_, { limit, sortOrder }) => {
            const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
            const query = `SELECT * FROM courses ORDER BY title ${order} LIMIT ?`;
            return new Promise((resolve, reject) => {
                db_1.default.query(query, [limit], (err, results) => {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
            });
        },
        course: (_, { id }) => {
            const query = `SELECT * FROM courses WHERE id = ?`;
            return new Promise((resolve, reject) => {
                db_1.default.query(query, [id], (err, results) => {
                    if (err)
                        reject(err);
                    else
                        resolve(results[0]);
                });
            });
        },
    },
    Mutation: {
        addCourse: (_, { input }) => {
            const query = `INSERT INTO courses (title, description, duration, outcome) VALUES (?, ?, ?, ?)`;
            return new Promise((resolve, reject) => {
                db_1.default.query(query, [input.title, input.description, input.duration, input.outcome], (err, results) => {
                    if (err)
                        reject(err);
                    else {
                        const newCourse = Object.assign({ id: results.insertId }, input);
                        resolve(newCourse);
                    }
                });
            });
        },
    },
};
exports.default = resolvers;
