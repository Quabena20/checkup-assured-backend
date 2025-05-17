const cron = require('node-cron');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

cron.schedule('30 2 1 * *', async () => {
  try {
    const totalClients = await User.countDocuments({ role: 'client' });
    const activeClients = await User.countDocuments({ role: 'client', active: true });
    const deactivated = totalClients - activeClients;

    const mainAdmin = await User.findOne({ role: 'mainAdmin' });

    const html = `
      <h3>Monthly Performance Report</h3>
      <p>Total Clients: ${totalClients}</p>
      <p>Active Clients: ${activeClients}</p>
      <p>Deactivated Clients: ${deactivated}</p>
    `;

    if (mainAdmin) {
      await sendEmail(mainAdmin.email, 'Monthly Company Report', html);
    }

    console.log('Monthly report sent to Main Admin');
  } catch (err) {
    console.error('Monthly report failed:', err);
  }
});
