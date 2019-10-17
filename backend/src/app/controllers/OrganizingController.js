import Meetup from '../models/Meetup';
import User from '../models/User';
import File from '../models/File';

class OrganizingController {
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

    if (meetups.length === 0) {
      return res
        .status(401)
        .json({ error: 'There are not meetups for this organizer.' });
    }

    return res.json(meetups);
  }
}

export default new OrganizingController();
