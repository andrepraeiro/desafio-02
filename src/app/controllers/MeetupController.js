import * as Yup from 'yup';
import { parseISO, isPast } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        organizer_id: req.userId,
      },
      attributes: ['id', 'title', 'description', 'datetime'],
      order: ['datetime'],
      include: [
        {
          model: User,
          as: 'organizer',
          attributes: ['id', 'name'],
          include: {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        },
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!meetups) {
      return res
        .status(401)
        .json({ error: 'There are not meetups for this organizer.' });
    }

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      datetime: Yup.date().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'Validation fails' });
    }

    const { datetime } = req.body;

    /**
     * Check if is a past date
     */

    if (isPast(parseISO(datetime))) {
      return res.status(400).json({ erro: 'Past dates are not permited' });
    }

    req.body = { ...req.body, organizer_id: req.userId };
    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
  }

  async update(req, res) {
    const { id, datetime } = req.body;

    const meetup = await Meetup.findByPk(id);
    if (!meetup) {
      return res.status(401).json({ error: 'Meetup not found' });
    }

    if (req.userId !== meetup.organizer_id) {
      return res
        .status(400)
        .json({ error: 'You are not organizer of this meetup.' });
    }

    if (isPast(parseISO(meetup.datetime))) {
      return res.status(400).json({ error: 'This meetup already happened.' });
    }

    if (isPast(parseISO(datetime))) {
      return res.status(400).json({ erro: 'Past dates are not permited' });
    }

    const {
      title,
      description,
      location,
      banner_id,
      organizer_id,
    } = await meetup.update(req.body);

    return res.json({
      id,
      title,
      description,
      location,
      datetime,
      banner_id,
      organizer_id,
    });
  }

  async delete(req, res) {
    const { id } = req.body;

    const meetup = await Meetup.findByPk(id);
    if (!meetup) {
      return res.status(401).json({ error: 'Meetup not found' });
    }

    if (req.userId !== meetup.organizer_id) {
      return res
        .status(400)
        .json({ error: 'You are not organizer of this meetup.' });
    }

    if (isPast(parseISO(meetup.datetime))) {
      return res.status(400).json({ error: 'This meetup already happened.' });
    }

    await meetup.destroy();

    return res.status(200).json({ message: 'Meetup deleted.' });
  }
}

export default new MeetupController();
