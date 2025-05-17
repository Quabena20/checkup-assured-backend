const cron = require('node-cron');
const User = require('../models/User');
const Package = require('../models/Package');

// Runs monthly
cron.schedule('0 2 1 * *', async () => {
  const now = new Date();
  const clients = await User.find({ role: 'client' });

  for (const client of clients) {
    const monthsUnpaid = client.lastPaymentDate
      ? Math.floor((now - client.lastPaymentDate) / (30 * 24 * 60 * 60 * 1000))
      : 999;

    if (monthsUnpaid >= 12) {
      client.active = false;
      client.paymentStatus = 'inactive';
      client.deactivatedSince = now;
      await client.save();
      continue;
    }

    if (client.paymentStatus === 'inactive' && client.lastPaymentDate) {
      const months = Math.floor((now - client.lastPaymentDate) / (30 * 24 * 60 * 60 * 1000));
      if (months < 1) {
        // Get package wait period
        const pkg = await Package.findOne({ name: client.packageSelected });
        const waitDays = pkg?.waitingPeriodDays || 30;

        client.active = true;
        client.paymentStatus = 'active';
        client.deactivatedSince = null;
        client.eligibleAfter = new Date(Date.now() + waitDays * 24 * 60 * 60 * 1000);
        await client.save();
      }
    }
  }

  console.log('Auto-deactivation/reactivation completed.');
});
