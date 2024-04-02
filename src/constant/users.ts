const cashierData = [
  {
    name: 'papa',
    password: 'papa123',
  },
  {
    name: 'dodo',
    password: 'dodo123',
  },
  {
    name: 'mama',
    password: 'mama123',
  },
];

export const checkPassword = (author: string, passwordCashier: string) => {
  const userIdx = cashierData.findIndex((v) => v.name == author);
  if (cashierData[userIdx].password === passwordCashier) {
    return true;
  }
  return false;
};
