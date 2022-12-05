export const randInt = (len: number) => {
  return Math.floor(len * Math.random());
};

export const randFromArray = (dataset: any[]) => {
  return dataset[randInt(dataset.length)];
};
