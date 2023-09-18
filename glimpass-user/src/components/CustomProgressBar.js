import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@emotion/styled';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
  root: {
    position: 'relative',
    height: 20,
    borderRadius: 5,
  },
  dot: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: 'red',
  },
});

const CustomProgressBar = ({ totalSteps, stepsWalked, shops }) => {
  const classes = useStyles();

  const progressPercentage = (stepsWalked / totalSteps) * 100;

  return (
    <div className={classes.root}>
      <LinearProgress variant="determinate" value={progressPercentage} />
      {shops.map((shop, index) => (
        <div
          key={index}
          className={classes.dot}
          style={{ left: `${(shop.step / totalSteps) * 100}%` }}
        ></div>
      ))}
    </div>
  );
};

export default CustomProgressBar;
