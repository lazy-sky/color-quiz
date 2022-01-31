import { useEffect } from 'react';
import { useState } from 'react';

import styled from 'styled-components';
interface ColorBoardProps {
  stage: number;
  setStage: (stage: number | ((stage: number) => number)) => void;
  remainingTime: number;
  setRemainingTime: (remainingTime: number | ((remainingTime: number) => number)) => void;
  setScore: (score: number | ((score: number) => number)) => void;
}
interface ColorProps {
  id: number;
  onClick: () => void;
  red: number;
  green: number;
  blue: number
}

const Grid = styled.ul`    
  list-style: none;
  padding: 0;

  display: grid;
  gap: 4px;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`;

function ColorBoard({ 
  stage, 
  setStage,
  remainingTime,
  setRemainingTime,
  setScore
}: ColorBoardProps) {
  let [baseRed, baseGreen, baseBlue] = [getRandomColor(), getRandomColor(), getRandomColor()];
  const [colors, setColors] = useState<ColorProps[] | []>([]);

  const makeBaseColor = (id: number) => {
    return {
      id,
      onClick: () => {
        setRemainingTime(remainingTime => remainingTime - 3);
      },
      red: baseRed,
      green: baseGreen,
      blue: baseBlue
    }
  }

  const makeRandomColors = () => {
    [baseRed, baseGreen, baseBlue] = [getRandomColor(), getRandomColor(), getRandomColor()];
    const tempColors = new Array(Math.pow(Math.round((stage + 0.5) / 2) + 1, 2) - 1)
      .fill(1)
      .map(color => makeBaseColor(Math.random()));
    tempColors.push({
      id: Math.random(),
      onClick: handleClickAnswer,
      red: baseRed - 26 + stage,
      green: baseGreen - 26 + stage,
      blue: baseBlue - 26 + stage
    });
    setColors(tempColors.sort(() => (Math.random() - 0.5)));
  }

  useEffect(() => {
    makeRandomColors();
  }, [stage])

  const handleClickAnswer = () => {
    setColors(colors);
    setScore(score => score + Math.pow(stage, 3) * remainingTime);
    setStage(stage => stage + 1);
    setRemainingTime(15);
  }

  return (
    <Grid style={{ 
      gridTemplateColumns: `repeat(${Math.round((stage + 0.5) / 2) + 1}, 1fr)`
    }}>
      {colors?.map(({ id, onClick, red, green, blue }) => (
        <li 
          key={id} 
          style={{ 
            backgroundColor: `rgb(${red},${green},${blue})`
          }}
          onClick={onClick}
        />
      ))}
    </Grid>
  );
};

function getRandomColor(): number {
  let randomInt = Math.floor(Math.random() * 257);
  return randomInt;
}

export default ColorBoard;
