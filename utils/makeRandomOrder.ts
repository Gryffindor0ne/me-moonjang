const makeRandomOrder = (length: number) => {
  const order = Array(length)
    .fill(0)
    .map((v, i) => i + 1);

  const newOrder = [];
  const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  while (order.length) {
    let min = 1;
    let max = order.length;
    let randomNum = random(min, max);
    newOrder.push(order[randomNum - 1]);
    order.splice(randomNum - 1, 1);
  }
  return newOrder;
};

export default makeRandomOrder;
