import Mail from '../../lib/mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle(data) {
    const { subscriptionData } = data.data;
    await Mail.sendMail({
      to: `${subscriptionData.organizerName}<${subscriptionData.organizerEmail}>`,
      subject: `Nova inscrição no meetup ${subscriptionData.meetupTitle}`,
      template: 'subscribe',
      context: {
        organizer: subscriptionData.organizerName,
        meetup: subscriptionData.meetupTitle,
        subscriber: subscriptionData.subscriberName,
        date: subscriptionData.date,
      },
    });
  }
}

export default new SubscriptionMail();
