import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Container, Content, Profile } from './styles';

import logo from '~/assets/logo.svg';
import Notifications from '../Notifications';
import { signOut } from '~/store/modules/auth/actions';

export default function Header() {
  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <div>
            <Link to="/dashboard">
              <img src={logo} alt="Meetapp" />
            </Link>
          </div>
        </nav>
        <aside>
          <Notifications />
          <Profile>
            <div>
              <strong>André Praeiro</strong>
              <Link to="/profile">Meu Perfil</Link>
            </div>
            <button type="button" onClick={handleSignOut}>
              Sair
            </button>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
