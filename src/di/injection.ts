import TransactionService from "../services/db/TransactionService";
import UserService from "../services/db/UserService";


export const userService = new UserService();
export const transactionService = new TransactionService();

