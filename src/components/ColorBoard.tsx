import { useEffect } from 'react';
import { useState } from 'react';

import styled from 'styled-components';
interface ColorBoardProps {
  stage: number;
  setStage: (stage: number | ((stage: number) => number)) => void;
  remainingTime: number;
  setRemainingTime: (remainingTime: number | ((remainingTime: number) => number)) => void;
  score: number;
  setScore: (score: number | ((score: number) => number)) => void;
};
interface ColorProps {
  id: number;
  onClick: () => void;
  red: number;
  green: number;
  blue: number;
};

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
  score,
  setScore
}: ColorBoardProps) {
  let [baseRed, baseGreen, baseBlue] = [getRandomColor(), getRandomColor(), getRandomColor()];
  const [colors, setColors] = useState<ColorProps[] | []>([]);

  function getRandomColor(): number {
    return Math.floor(Math.random() * 257);
  };

  const makeBaseColor = (id: number) => {
    return {
      id,
      onClick: () => {
        // TODO: 음수가 안되도록, 0으로 보여주고, 바로 게임오버
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
      onClick: () => setStage(stage => stage + 1),
      red: baseRed - 26 + stage,
      green: baseGreen - 26 + stage,
      blue: baseBlue - 26 + stage
    });
    setColors(tempColors.sort(() => (Math.random() - 0.5)));
  }

  useEffect(() => {
    setRemainingTime(15);
  }, []);

  useEffect(() => {
    makeRandomColors();
    if (score === 0) {
      setScore(remainingTime);
      return;
    };

    setScore(score => score + Math.pow(stage, 3) * remainingTime);
    // handleClickAnswer 안에서 처리하면 남은 시간이 계속 15초로 계산되어 점수에 반영되는 문제 해결
    setRemainingTime(15);
  }, [stage]);

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

export default ColorBoard;
