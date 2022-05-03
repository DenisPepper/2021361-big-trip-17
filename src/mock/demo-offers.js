import { POINT_TYPE } from './demo-const';

export const getDemoOffers = () => {
  const offers = [];
  offers.push({
    type: POINT_TYPE,
    offers: [
      { id: 1, title: 'Add luggage', price: 30 },
      { id: 2, title: 'Switch to comfort class', price: 100 },
      { id: 2, title: 'Add meal', price: 15 },
      { id: 2, title: 'Choose seats', price: 5 },
      { id: 2, title: 'Travel by train', price: 40 },
    ],
  });
  return offers;
};
