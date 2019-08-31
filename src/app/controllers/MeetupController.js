import * as Yup from 'yup';
import { parseISO, isPast } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
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
}

export default new MeetupController();
