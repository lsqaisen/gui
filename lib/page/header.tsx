import * as React from 'react';

export interface HeaderProps {
  rightComp?: React.ReactNode;
  leftComp?: React.ReactNode;
}
const Header = ({ rightComp, leftComp }: HeaderProps) => (
  <header style={{ overflow: 'hidden', marginBottom: 16 }}>
    <div style={{ float: 'left' }}>
      {leftComp}
    </div>
    <div style={{ float: 'right' }}>
      {rightComp}
    </div>
  </header>
)

export default Header;