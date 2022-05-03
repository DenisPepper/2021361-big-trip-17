import { getDemoPoint } from '../mock/demo-point';
import { POINTS_COUNT } from '../const';

export default class PointModel {
  points = Array.from({ length: POINTS_COUNT }, getDemoPoint);
  getPoints = () => this.points;
}
