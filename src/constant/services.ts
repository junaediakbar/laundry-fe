export const services = [
  {
    name: 'Cuci Lipat',
    value: 'cuci-lipat',
    price: 6000,
  },
  {
    name: 'Cuci Setrika',
    value: 'cuci-setrika',
    price: 7000,
  },
  {
    name: 'Setrika',
    value: 'setrika',
    price: 5000,
  },
  {
    name: 'Cuci Lipat Express',
    value: 'cuci-lipat-express',
    price: 10000,
  },
  {
    name: 'Lainnya',
    value: 'lainnya',
    price: 0,
  },
  {
    name: 'Setrika Express',
    value: 'setrika-express',
    price: 8000,
  },
  {
    name: 'Cuci Setrika Expreess',
    value: 'cuci-setrika-express',
    price: 12000,
  },
];

export const getServicePrice = (selectedService: string) => {
  if (selectedService === 'cuci-lipat') return 6000;
  if (selectedService === 'cuci-setrika') return 7000;
  if (selectedService === 'setrika') return 5000;
  if (selectedService === 'cuci-lipat-express') return 10000;
  if (selectedService === 'setrika-express') return 8000;
  if (selectedService === 'cuci-setrika-express') return 12000;
  if (selectedService === 'lainnya') return 0;
  return 0;
};

export const getLabelService = (selectedService: string) => {
  if (selectedService === 'cuci-lipat') return 'Cuci Lipat';
  if (selectedService === 'cuci-setrika') return 'Cuci Setrika';
  if (selectedService === 'setrika') return 'Setrika';
  if (selectedService === 'cuci-lipat-express') return 'Cuci Lipat Express';
  if (selectedService === 'setrika-express') return 'Setrika Express';
  if (selectedService === 'cuci-setrika-express') return 'Cuci Setrika Express';
  if (selectedService === 'lainnya') return 'Lainnya';
  return '';
};

export const isServiceExpress = (selectedService: string) => {
  if (selectedService.includes('express')) return true;
  return false;
};
