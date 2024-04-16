export const services = [
  {
    name: 'cuci-lipat',
    value: 'Cuci Lipat',
    price: 6000,
  },
  {
    name: 'cuci-komplit',
    value: 'Cuci Komplit',
    price: 8000,
  },
  {
    name: 'setrika',
    value: 'Setrika',
    price: 5000,
  },
  {
    name: 'seprai-3s-nomor-3/4',
    value: 'Seprai + 3S Nomor 3/4',
    price: 10000,
  },
  {
    name: 'seprai-3s-nomor-2',
    value: 'Seprai + 3S Nomor 2',
    price: 15000,
  },
  {
    name: 'seprai-4s-nomor-1',
    value: 'Seprai + 4S Nomor 1',
    price: 20000,
  },
  {
    name: 'selimut-nomor-3/4',
    value: 'Selimut Nomor 3/4',
    price: 10000,
  },
  {
    name: 'selimut-nomor-2',
    value: 'Selimut Nomor 2',
    price: 15000,
  },
  {
    name: 'selimut-nomor-1',
    value: 'Selimut Nomor 1',
    price: 20000,
  },
  {
    name: 'selimut-double-nomor-3/4',
    value: 'Selimut Double Nomor 3/4',
    price: 30000,
  },
  {
    name: 'selimut-double-nomor-2',
    value: 'Selimut Double Nomor 2',
    price: 40000,
  },
  {
    name: 'selimut-double-nomor-1',
    value: 'Selimut Double Nomor 1',
    price: 50000,
  },
  {
    name: 'karpet',
    value: 'Karpet',
    price: 15000,
  },
  {
    name: 'lainnya',
    value: 'Lainnya',
    price: 0,
  },
];

export const getServicePrice = (selectedService: string) => {
  if (selectedService === 'cuci-lipat') return 6000;
  if (selectedService === 'cuci-komplit') return 8000;
  if (selectedService === 'setrika') return 5000;
  if (selectedService === 'seprai-3s-nomor-3/4') return 10000;
  if (selectedService === 'seprai-3s-nomor-2') return 15000;
  if (selectedService === 'seprai-4s-nomor-1') return 20000;
  if (selectedService === 'selimut-nomor-3/4') return 10000;
  if (selectedService === 'selimut-nomor-2') return 15000;
  if (selectedService === 'selimut-nomor-1') return 20000;
  if (selectedService === 'selimut-double-nomor-3/4') return 30000;
  if (selectedService === 'selimut-double-nomor-2') return 40000;
  if (selectedService === 'selimut-double-nomor-1') return 50000;
  if (selectedService === 'karpet') return 15000;
  if (selectedService === 'lainnya') return 0;
  return 0;
};

export const getLabelService = (selectedService: string) => {
  if (selectedService === 'cuci-lipat') return 'Cuci Lipat';
  if (selectedService === 'cuci-komplit') return 'Cuci Komplit';
  if (selectedService === 'setrika') return 'Setrika';
  if (selectedService === 'seprai-3s-nomor-3/4') return 'Seprai + 3S Nomor 3/4';
  if (selectedService === 'seprai-3s-nomor-2') return 'Seprai + 3S Nomor 2';
  if (selectedService === 'seprai-4s-nomor-1') return 'Seprai + 4S Nomor 1';
  if (selectedService === 'selimut-nomor-3/4') return 'Selimut Nomor 3/4';
  if (selectedService === 'selimut-nomor-2') return 'Selimut Nomor 2';
  if (selectedService === 'selimut-nomor-1') return 'Selimut Nomor 1';
  if (selectedService === 'selimut-double-nomor-3/4')
    return 'Selimut Double Nomor 3/4';
  if (selectedService === 'selimut-double-nomor-2')
    return 'Selimut Double Nomor 2';
  if (selectedService === 'selimut-double-nomor-1')
    return 'Selimut Double Nomor 1';
  if (selectedService === 'karpet') return 'Karpet';
  if (selectedService === 'lainnya') return 'Lainnya';
  return '';
};

export const isServiceExpress = (selectedService: string) => {
  if (selectedService.includes('express')) return true;
  return false;
};
