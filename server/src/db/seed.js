import { prisma } from "./client.js";

export async function seedDefaultCategoriesForUser(userId) {
  const expense = ["Food", "Transport", "Rent", "Shopping", "Bills", "Health"];
  const income = ["Salary", "Freelance", "Gift", "Investments"];

  const data = [
    ...expense.map((name) => ({ name, type: "EXPENSE", userId })),
    ...income.map((name) => ({ name, type: "INCOME", userId }))
  ];

  await prisma.category.createMany({
    data,
    skipDuplicates: true
  });
}
