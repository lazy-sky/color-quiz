import { useEffect } from 'react';
import { useState } from 'react';

interface ColorBoardProps {
  stage: number;
  setStage: (stage: number | ((stage: number) => number)) => void;
  remainingTime: number;
  setRemainingTime: (remainingTime: number | ((remainingTime: number) => number)) => void;
  setScore: (score: number | ((score: number) => number)) => void;
}
interface ColorProps {
  id: number,
  onClick: () => void,
  red: number,
  green: number,
  blue: number
}

function ColorBoard({ 
  stage, 
  setStage,
  remainingTime,
  setRemainingTime,
  setScore
}: ColorBoardProps) {
  let [baseRed, baseGreen, baseBlue] = [getRandomColor(), getRandomColor(), getRandomColor()];
  const [colors, setColors] = useState<ColorProps[] | []>([]);

  const makeRandomColors = () => {
    [baseRed, baseGreen, baseBlue] = [getRandomColor(), getRandomColor(), getRandomColor()];
    setColors([
      {
        id: 1,
        onClick: () => {
          setRemainingTime(remainingTime => remainingTime - 3);
        },
        red: baseRed,
        green: baseGreen,
        blue: baseBlue
      },
      {
        id: 2,
        onClick: () => {
          setRemainingTime(remainingTime => remainingTime - 3);
        },
        red: baseRed,
        green: baseGreen,
        blue: baseBlue
      },
      {
        id: 3,
        onClick: () => {
          setRemainingTime(remainingTime => remainingTime - 3);
        },
        red: baseRed,
        green: baseGreen,
        blue: baseBlue
      },
      {
        id: 4,
        onClick: () => {
          makeRandomColors();
          // TODO: stage, remainingTime이 갱신되지 않고 초기값으로 나타난다.
          console.log(stage, remainingTime);
          setScore(score => score + Math.pow(stage, 3) * remainingTime);
          setStage(stage => stage + 1);
        },
        red: baseRed - 25,
        green: baseGreen - 25,
        blue: baseBlue -25
      },
    ].sort(() => (Math.random() - 0.5)));
  }

  useEffect(() => {
    makeRandomColors();
  }, [])

  return (
    <>
      {colors?.map(({ id, onClick, red, green, blue }) => (
        <li 
          key={id} 
          style={{ backgroundColor: `rgb(${red},${green},${blue})` }}
          onClick={onClick}
        >
          색깔
        </li>
      ))}
    </>
  );
};

function getRandomColor(): number {
  let randomInt = Math.floor(Math.random() * 257);
  return randomInt;
}

export default ColorBoard;