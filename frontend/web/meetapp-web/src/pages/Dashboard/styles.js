import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;

  ul {
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;
      margin: 0 0 10px;
      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          margin-right: 32px;
        }
      }
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30px 0;
  h1 {
    color: #fff;
  }
  button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    align-self: flex-end;
    padding: 0 20px;
    width: 162px;
    margin: 5px 0 0;
    height: 42px;
    background: #f94d6a;
    font-weight: bold;
    color: #fff;
    border: 0;
    border-radius: 4px;
    transition: background 0.2s;
    &:hover {
      background: ${darken(0.05, '#F94D6A')};
    }
  }
`;
