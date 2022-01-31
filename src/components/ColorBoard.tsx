import { useState } from 'react';

interface ColorProps {
  id: number,
  onClick: () => void,
  red: number,
  green: number,
  blue: number
}

function ColorBoard() {
  let [baseRed, baseGreen, baseBlue] = [getRandomColor(), getRandomColor(), getRandomColor()];
  const [colors, setColors] = useState<ColorProps[]>([
    {
      id: 1,
      onClick: () => console.log('wrong!'),
      red: baseRed,
      green: baseGreen,
      blue: baseBlue
    },
    {
      id: 2,
      onClick: () => console.log('wrong!'),
      red: baseRed,
      green: baseGreen,
      blue: baseBlue
    },
    {
      id: 3,
      onClick: () => console.log('wrong!'),
      red: baseRed,
      green: baseGreen,
      blue: baseBlue
    },
    {
      id: 4,
      onClick: () => makeRandomColors(),
      red: baseRed - 25,
      green: baseGreen - 25,
      blue: baseBlue -25
    },
  ]);

  const makeRandomColors = () => {
    [baseRed, baseGreen, baseBlue] = [getRandomColor(), getRandomColor(), getRandomColor()];
    setColors([
      {
        id: 1,
        onClick: () => console.log('wrong!'),
        red: baseRed,
        green: baseGreen,
        blue: baseBlue
      },
      {
        id: 2,
        onClick: () => console.log('wrong!'),
        red: baseRed,
        green: baseGreen,
        blue: baseBlue
      },
      {
        id: 3,
        onClick: () => console.log('wrong!'),
        red: baseRed,
        green: baseGreen,
        blue: baseBlue
      },
      {
        id: 4,
        onClick: () => makeRandomColors(),
        red: baseRed - 25,
        green: baseGreen - 25,
        blue: baseBlue -25
      },
    ])
  }

  return (
    <>
      {colors.map(({ id, onClick, red, green, blue }) => (
        <li 
          key={id} 
          style={{ backgroundColor: `rgb(${red},${green},${blue})` }}
          onClick={onClick}
        >
          색깔
        </li>
      )).sort(() => (
        Math.random() - 0.5
      ))}
    </>
  );
};

function getRandomColor(): number {
  let randomInt = Math.floor(Math.random() * 257);
  return randomInt;
}

export default ColorBoard;