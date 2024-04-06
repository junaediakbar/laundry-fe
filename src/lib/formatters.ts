export const getDateFormatted = (date: string) => {
  const number = new Date(date);

  return number.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

export const getPriceFormmated = (price: number) => {
  let str = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
  str = str.replace(/,00$/, '');
  return str;
};
