import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 0 30 px;
`;

export const Content = styled.div`
  height: 64px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  nav {
    display: flex;
    align-items: center;

    img {
      width: 32px;
      height: 32px;
    }
  }
  aside {
    display: flex;
    align-items: center;
  }
`;

export const Profile = styled.div`
  display: flex;
  margin-left: 20px;
  padding-left: 20px;
  align-items: center;
  div {
    text-align: right;
    margin-right: 30px;
    strong {
      display: block;
      color: #fff;
    }

    a {
      display: block;
      margin-top: 2px;
      font-size: 12px;
      color: #999;
    }
  }
  button {
    background: #d44059;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    width: 71px;
    height: 42px;
    border-radius: 4px;
    border: 0;
    transition: background 0.2s;
    &:hover {
      background: ${darken(0.05, '#d44059')};
    }
  }
`;
