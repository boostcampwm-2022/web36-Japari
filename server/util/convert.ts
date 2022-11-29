export const redisRecordToObject = (record: Record<string, string>) => {
  const obj = {};
  Object.entries(record).forEach(([key, value]) => {
    obj[key] = JSON.parse(value);
  });
  return obj;
};
