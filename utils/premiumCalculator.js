function calculateMonthlyPremium(X, constant, frequency) {
  let totalX = X;
  if (frequency === 'biannual') totalX = 2 * X;
  else if (frequency === 'quarterly') totalX = 4 * X;
  const total = totalX + constant;
  const monthly = total / 12;
  return Math.ceil(monthly);
}
module.exports = { calculateMonthlyPremium };
