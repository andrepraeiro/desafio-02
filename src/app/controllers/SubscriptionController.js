import * as Yup from 'yup';
import { isPast } from 'date-fns';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      meetup_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { meetup_id } = req.body;

    const meetup = await Meetup.findByPk(meetup_id);

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
        meetup_id,
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

    req.body = { ...req.body, subscriber_id: req.userId };
    const subscription = await Subscription.create(req.body);
    return res.json(subscription);
  }
}

export default new SubscriptionController();
