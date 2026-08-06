import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

const logMetric = (metric: Metric): void => {
  if (!import.meta.env.DEV) {
    return;
  }

  console.info('[web-vital]', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    navigationType: metric.navigationType,
  });
};

export const reportWebVitals = (): void => {
  onCLS(logMetric);
  onFCP(logMetric);
  onINP(logMetric);
  onLCP(logMetric);
  onTTFB(logMetric);
};
