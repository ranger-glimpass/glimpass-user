import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";

const CountdownButton = ({ handlePrevious, buttonText }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(5);
  }, [buttonText]);

  useEffect(() => {
    let timer;
    if (count > 0) {
      timer = setInterval(() => {
        if (count === 1) {
          clearInterval(timer);
        }
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [count]);

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={count > 0 ? null : handlePrevious}
      >
        {count === 0 ? `${buttonText}` : `${buttonText}: ${count}`}
      </Button>
    </div>
  );
};

export default CountdownButton;
