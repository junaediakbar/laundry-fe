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
    name: 'selimut-nomor-3/4-express',
    value: 'Selimut Nomor 3/4 Express',
    price: 10000 * 1.5,
  },
  {
    name: 'selimut-nomor-2-express',
    value: 'Selimut Nomor 2 Express',
    price: 15000 * 1.5,
  },
  {
    name: 'selimut-nomor-1-express',
    value: 'Selimut Nomor 1 Express',
    price: 20000 * 1.5,
  },
  {
    name: 'selimut-double-nomor-3/4-express',
    value: 'Selimut Double Nomor 3/4 Express',
    price: 30000 * 1.5,
  },
  {
    name: 'selimut-double-nomor-2-express',
    value: 'Selimut Double Nomor 2 Express',
    price: 40000 * 1.5,
  },
  {
    name: 'selimut-double-nomor-1-express',
    value: 'Selimut Double Nomor 1 Express',
    price: 50000 * 1.5,
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
  {
    name: 'cuci-lipat-express',
    value: 'Cuci Lipat Express',
    price: 1,
  },
  {
    name: 'cuci-komplit-express',
    value: 'Cuci Komplit Express',
    price: 1,
  },
  {
    name: 'selimut-express',
    value: 'Selimut Express',
    price: 1,
  },
];

export const getServicePerPrice = (
  selectedService: string,
  weight: number,
  defaultPerPrice?: number,
) => {
  if (defaultPerPrice) {
    return defaultPerPrice;
  } else {
    if (weight === 0) {
      return getServiceBasicPrice(selectedService);
    }
    if (selectedService === 'cuci-lipat') {
      if (weight < 3) return Math.floor((6000 * 3) / weight);
      return 6000;
    }
    if (selectedService === 'cuci-komplit') {
      if (weight < 3) return Math.floor(8000 * 3) / weight;
      return 8000;
    }
    if (selectedService === 'cuci-lipat-express') {
      if (weight < 3) return Math.floor(25000 / weight);
      return Math.floor((25000 + (weight - 3) * 8000) / weight);
    }
    if (selectedService === 'cuci-komplit-express') {
      if (weight < 3) return Math.floor(40000 / weight);
      return Math.floor((40000 + (weight - 3) * 12000) / weight);
    } else return getServiceBasicPrice(selectedService);
  }
};

export const getServiceTotalPrice = (
  selectedService: string,
  weight: number,
  customPerPrice?: number,
  defaultTotalPrice?: number,
) => {
  if (defaultTotalPrice) {
    return defaultTotalPrice;
  } else {
    if (selectedService === 'lainnya') {
      const perprice = customPerPrice ? customPerPrice : 0;
      return weight * perprice;
    }
    if (selectedService === 'cuci-lipat') {
      if (weight < 3) return 3 * 6000;
      return weight * 6000;
    }
    if (selectedService === 'cuci-komplit') {
      if (weight < 3) return 3 * 8000;
      return weight * 8000;
    }
    if (selectedService === 'cuci-komplit') {
      if (weight < 3) return 25000;
      return 8000;
    }
    if (selectedService === 'cuci-lipat-express') {
      if (weight < 3) return 25000;
      return Math.floor(25000 + (weight - 3) * 8000);
    }
    if (selectedService === 'cuci-komplit-express') {
      if (weight < 3) return 40000;
      return Math.floor(40000 + (weight - 3) * 12000);
    } else {
      return Math.floor(weight * getServicePerPrice(selectedService, weight));
    }
  }
};

export const getServiceBasicPrice = (selectedService: string) => {
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
  if (selectedService === 'cuci-lipat-express') return 8000;
  if (selectedService === 'cuci-komplit-express') return 12000;
  if (selectedService === 'karpet') return 15000;
  if (selectedService === 'selimut-nomor-3/4-express') return 10000 * 1.5;
  if (selectedService === 'selimut-nomor-2-express') return 15000 * 1.5;
  if (selectedService === 'selimut-nomor-1-express') return 20000 * 1.5;
  if (selectedService === 'selimut-double-nomor-3/4-express')
    return 30000 * 1.5;
  if (selectedService === 'selimut-double-nomor-2-express') return 40000 * 1.5;
  if (selectedService === 'selimut-double-nomor-1-express') return 50000 * 1.5;
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
  if (selectedService === 'cuci-lipat-express') return 'Cuci Lipat Express';
  if (selectedService === 'cuci-komplit-express') return 'Cuci Komplit Express';
  if (selectedService === 'selimut-express') return 'Selimut Express';
  if (selectedService === 'selimut-nomor-3/4-express')
    return 'Selimut Nomor 3/4 Express';
  if (selectedService === 'selimut-nomor-2-express')
    return 'Selimut Nomor 2 Express';
  if (selectedService === 'selimut-nomor-1-express')
    return 'Selimut Nomor 1 Express';
  if (selectedService === 'selimut-double-nomor-3/4-express')
    return 'Selimut Double Nomor 3/4 Express';
  if (selectedService === 'selimut-double-nomor-2-express')
    return 'Selimut Double Nomor 2 Express';
  if (selectedService === 'selimut-double-nomor-1-express')
    return 'Selimut Double Nomor 1 Express';
  if (selectedService === 'lainnya') return 'Lainnya';
  return '';
};

export const isServiceExpress = (selectedService: string) => {
  if (
    selectedService != '' &&
    selectedService?.includes('express') &&
    !selectedService?.includes('selimut')
  )
    return true;
};
