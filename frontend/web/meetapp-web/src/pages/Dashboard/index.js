import React, { useState, useEffect } from 'react';
import { MdAddCircleOutline, MdKeyboardArrowRight } from 'react-icons/md';
import { Container, Header } from './styles';
import api from '~/services/api';

export default function Dashboard() {
  const [meetup, setMeetup] = useState([]);

  useEffect(() => {
    async function loadMeetup() {
      const response = await api.get('organizing', {});
      setMeetup(response.data);
    }
    loadMeetup();
  }, [meetup]);

  return (
    <Container>
      <Header>
        <h1>Meus meetups</h1>
        <button type="button">
          <MdAddCircleOutline size={20} color="#fff" />
          Novo meetup
        </button>
      </Header>
      <ul>
        {meetup.map(meet => (
          <li key={meet.id}>
            <strong>{meet.title}</strong>
            <div>
              <span>{meet.datetime}</span>
              <MdKeyboardArrowRight size={20} color="#fff" />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
