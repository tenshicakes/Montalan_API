function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);

  return {
    question: `${num1} + ${num2}`,
    answer: num1 + num2
  };
}

module.exports = generateCaptcha;