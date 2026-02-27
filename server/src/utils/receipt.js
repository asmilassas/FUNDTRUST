const buildReceiptNumber = (donation) => {
  const datePart = donation.createdAt ? donation.createdAt.toISOString().split('T')[0].replace(/-/g, '') : 'PENDING';
  return `RCPT-${datePart}-${donation._id.toString().slice(-6).toUpperCase()}`;
};

const generateReceipt = ({ donation, user, charity }) => {
  const receiptNumber = buildReceiptNumber(donation);
  return {
    receiptNumber,
    issuedAt: new Date().toISOString(),
    donor: {
      name: user.name,
      email: user.email,
    },
    charity: {
      id: charity._id,
      name: charity.name,
    },
    donation: {
      amount: donation.amount,
      currency: donation.currency,
      frequency: donation.frequency,
      status: donation.status,
      stripePaymentIntentId: donation.stripePaymentIntentId,
      stripeSubscriptionId: donation.stripeSubscriptionId,
    },
    impactNote:
      donation.impactNote ||
      `Your donation helps advance ${charity.mission.toLowerCase()}. Thank you for supporting our cause!`,
  };
};

module.exports = {
  generateReceipt,
};