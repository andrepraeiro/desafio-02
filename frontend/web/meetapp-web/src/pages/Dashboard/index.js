import React from 'react';
import { MdAddCircleOutline, MdKeyboardArrowRight } from 'react-icons/md';
import { Container, Header } from './styles';

export default function Dashboard() {
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
        <li>
          <strong>Meetup do react native</strong>
          <div>
            <span>24 de Junho, às 20h</span>
            <MdKeyboardArrowRight size={20} color="#fff" />
          </div>
        </li>
        <li>
          <strong>Meetup do react native</strong>
          <div>
            <span>24 de Junho, às 20h</span>
            <MdKeyboardArrowRight size={20} color="#fff" />
          </div>
        </li>
        <li>
          <strong>Meetup do react native</strong>
          <div>
            <span>24 de Junho, às 20h</span>
            <MdKeyboardArrowRight size={20} color="#fff" />
          </div>
        </li>
        <li>
          <strong>Meetup do react native</strong>
          <div>
            <span>24 de Junho, às 20h</span>
            <MdKeyboardArrowRight size={20} color="#fff" />
          </div>
        </li>
      </ul>
    </Container>
  );
}
