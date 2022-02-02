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

interface RGBProps {
  red: number;
  green: number;
  blue: number;
}

interface ColorProps {
  id: number;
  onClick: () => void;
  rgb: RGBProps;
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
  const initialDifficulty = 26;
  const [colors, setColors] = useState<ColorProps[] | []>([]);

  function getRandomColor(): RGBProps {
    return {
      red: Math.floor(Math.random() * 257), 
      green: Math.floor(Math.random() * 257), 
      blue: Math.floor(Math.random() * 257)
    };
  };

  const makeBaseColor = (id: number, rgb: RGBProps) => {
    return {
      id,
      rgb,
      onClick: () => {
        setRemainingTime(remainingTime => Math.max(0, remainingTime - 3));
      },
    }
  }

  const makeRandomColors = () => {
    const { red, green, blue } = getRandomColor();
    const newColors = new Array(Math.pow(Math.round((stage + 0.5) / 2) + 1, 2) - 1)
      .fill(1)
      .map(_ => makeBaseColor(Math.random(), { red, green, blue }));
    const answerColor = {
      id: Math.random(),
      onClick: () => setStage(stage => stage + 1),
      rgb: {
        red: red - initialDifficulty + Math.min(initialDifficulty - 1, stage),
        green: green - initialDifficulty + Math.min(initialDifficulty - 1, stage),
        blue: blue - initialDifficulty + Math.min(initialDifficulty - 1, stage)
      }
    }
    newColors.push(answerColor);
    setColors(newColors.sort(() => (Math.random() - 0.5)));
  }

  useEffect(() => {
    setRemainingTime(prev => 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    makeRandomColors();
    if (score === 0) {
      setScore(remainingTime);
      return;
    };

    setScore(score => score + Math.pow(stage, 3) * remainingTime);
    setRemainingTime(prev => 15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return (
    <Grid style={{ 
      gridTemplateColumns: `repeat(${Math.round((stage + 0.5) / 2) + 1}, 1fr)`
    }}>
      {colors?.map(({ id, onClick, rgb }) => (
        <li 
          key={id} 
          style={{ 
            backgroundColor: `rgb(${rgb.red},${rgb.green},${rgb.blue})`
          }}
          onClick={onClick}
        />
      ))}
    </Grid>
  );
};

export default ColorBoard;
