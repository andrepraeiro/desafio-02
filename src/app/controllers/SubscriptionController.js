import { isPast } from 'date-fns';
import { Op } from 'sequelize';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';

import Notification from '../schemas/Notification';
import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/queue';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        subscriber_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            datetime: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [['meetup', 'datetime']],
    });
    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);

    if (!meetup) {
      return res.status(401).json({ error: 'Meetup not found' });
    }

    if (meetup.organizer_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe to meetups organized by you.' });
    }

    if (isPast(meetup.datetime)) {
      return res
        .status(400)
        .json({ erro: 'You cannot subscribe to passed meetups.' });
    }

    const subscriptionExists = await Subscription.findOne({
      where: {
        meetup_id: req.params.meetupId,
        subscriber_id: req.userId,
      },
    });

    if (subscriptionExists) {
      return res
        .status(400)
        .json({ erro: 'You already subscribed to this meetup.' });
    }

    const subscriptionSameDateExists = await Subscription.findOne({
      where: {
        subscriber_id: req.userId,
      },
      include: {
        model: Meetup,
        as: 'meetup',
        where: { datetime: meetup.datetime },
      },
    });

    if (subscriptionSameDateExists) {
      return res
        .status(400)
        .json({ erro: 'You already subscribed to a meetup in the same date' });
    }

    const subscription = await Subscription.create({
      subscriber_id: req.userId,
      meetup_id: req.params.meetupId,
    });

    const subscriber = await User.findByPk(req.userId);
    const organizer = await User.findByPk(meetup.organizer_id);

    await Notification.create({
      content: `Nova inscrição de ${subscriber.name} para o meetup ${meetup.title}`,
      user: meetup.organizer_id,
    });

    const subscriptionData = {
      organizerName: organizer.name,
      organizerEmail: organizer.email,
      meetupTitle: meetup.title,
      subscriberName: subscriber.name,
      date: subscription.createdAt,
    };
    Queue.add(SubscriptionMail.key, { subscriptionData });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
