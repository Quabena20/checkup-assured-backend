const cron = require('node-cron');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// Runs daily at 00:00
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const clients = await User.find({
      role: 'client',
      active: true,
      nextAppointment: {
        $gte: nextMonth,
        $lt: new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 1)
      }
    });

    for (const client of clients) {
      await sendEmail(
        client.email,
        'Upcoming Check-Up Reminder',
        `<p>Hi ${client.fullName}, your check-up is coming up next month. Please stay prepared.</p>`
      );
    }

    console.log('Reminders sent to upcoming clients');
  } catch (err) {
    console.error('Reminder job error:', err);
  }
});
