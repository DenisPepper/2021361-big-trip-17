import { getRandomInteger } from '../util';
import { PHOTO_COUNT, POINT_NAME } from './demo-const';

export const getDemoDestinations = () => {
  const destinations = [];
  destinations.push({
    description:
      'Это невероятно классная маршрутная точка, которую точно стоит посетить с друзьями. Незабываемые впечатления и хорошее настроение гарантируется!',
    pointName: POINT_NAME,
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(
          0,
          PHOTO_COUNT
        )}`,
        description: 'это описание фотографии',
      },
    ],
  });
  return destinations;
};
