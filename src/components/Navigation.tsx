import { Link } from 'react-router-dom'

import styled from 'styled-components'

const NavConatainer = styled.nav`
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 24px;
    padding: 0;

    a {
      font-size: 24px;
      text-decoration: none;
    }
  }
`

const Navigation = () => {
  return (
    <NavConatainer>
      <ul>
        <li>
          <Link to='/' style={{ color: '#FDF7FF' }}>
            퀴즈!
          </Link>
        </li>
        <li>
          <Link to='/rank' style={{ color: '#FDF7FF' }}>
            순위판
          </Link>
        </li>
      </ul>
    </NavConatainer>
  )
}

export default Navigation
