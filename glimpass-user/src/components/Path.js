import React, { useRef, forwardRef } from "react";

const Path = forwardRef(({ route }, ref) => {
    const svgWidth = 400;
    const svgHeight = 400;
    const scaleFactor = 3;

    let currentX = svgWidth / 2;
    let currentY = svgHeight - 50; // Starting a bit above the bottom
    let pathD = `M ${currentX} ${currentY}`;

    route.forEach((item, index) => {
        if (item.relationId) {
            let angle;
            if (index === 0) {
                // For the first segment, always draw straight up
                angle = 270;
            } else {
                angle = item.angle;
            }
            const steps = item.steps * scaleFactor;
            const dx = steps * Math.cos((angle * Math.PI) / 180);
            const dy = steps * Math.sin((angle * Math.PI) / 180);
            currentX += dx;
            currentY += dy;
            pathD += ` L ${currentX} ${currentY}`;
        }
    });
 // Create a ref for the path
  const pathRef = React.useRef(null);
 console.log("pathD= " + pathD);
 return (
     <>
         <path ref={ref} d={pathD} stroke="red" strokeWidth="3" fill="none" />
         {pathD.split('L').slice(1).map((point, index) => {
             const [x, y] = point.trim().split(' ');
             return <circle key={index} cx={x} cy={y} r="3" fill="blue" />;
         })}
     </>
 );

});

export default Path;