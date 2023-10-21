import React, {useState, useEffect, useRef, forwardRef } from "react";

import { useNavigate } from "react-router-dom";
import navigationArrow from "../assets/navigationArrow.svg";
import pinPoint from '../assets/pinPoint.svg';
const Path = forwardRef(({ route,setViewBox, stepsWalked, totalSteps, adjustedAng, selectedShopCoords, nodeSelected, setNodeSelected}, ref) => {
    
  const navigate = useNavigate();
    console.log(adjustedAng,"adjeusted")
    // const pathRef = useRef(null);
    const arrowWidth = 20;
    const arrowHeight = 20;
    
    const svgWidth = 400;
    const svgHeight = 400;
    const scaleFactor = 3;

    //const [currentStep, setCurrentStep] = useState(0);
    const [arrowPoint, setArrowPoint] = useState({ x: svgWidth / 2, y: svgHeight / 2 });
    const [currentShop, setCurrentShop] = useState(null);
    const [c_angle, setangle] = useState(0);

useEffect(() => {
console.log(ref.current, "pathref");
if (nodeSelected) {
    // if (selectedShopCoords) {
        setArrowPoint(selectedShopCoords);
    //   }
    setNodeSelected(false);  // Reset the state
}
else{
    if (ref.current && ref.current.getTotalLength() > 0) {
        const pathLength = ref.current.getTotalLength();
        const distance = (stepsWalked / totalSteps) * pathLength;
        // if(!distance){
        //     window.alert("Not yet mapped, Stay Tuned! ");
        //     navigate("/markets");
        //     return;
        // }
        console.log(totalSteps,"pointnnnnnnnnn")
        const point = ref.current.getPointAtLength(distance);
        setArrowPoint(point);

        let reachedShop = null;
        for (let i = 0; i < route.length; i++) {
            if (route[i].steps <= stepsWalked) {
                reachedShop = route[i];
            } else {
                break;
            }
        }
        setCurrentShop(reachedShop);

        if (currentShop) {
            setArrowPoint({ x: currentShop.x, y: currentShop.y }); // Assuming your shop items have x and y properties.
        }
    }
    if (selectedShopCoords) {
        setArrowPoint(selectedShopCoords);
        console.log("selected coords", selectedShopCoords)
      }
}
    }, [stepsWalked, totalSteps, route.length, selectedShopCoords, nodeSelected]);
  


    let currentX = svgWidth / 2;
    let currentY = svgHeight / 2; // Starting at the center
    let pathD = `M ${currentX} ${currentY}`;

    let nodesOnPath = []; // Array to store the nodes that correspond to the points on the path

    let minX = currentX;
    let minY = currentY;
    let maxX = currentX;
    let maxY = currentY;

    route.forEach((item, index) => {
        if (item.relationId) {
            let angle;
            if (index === 0) {
                angle = 270;
            } else {
                angle = item.angle;
            }
            const steps = item.steps * scaleFactor;
            const dx = steps * Math.cos(((angle) * Math.PI) / 180);
            const dy = steps * Math.sin(((angle) * Math.PI) / 180);
           // setangle(angle);
            currentX += dx;
            currentY += dy;
            pathD += ` L ${currentX} ${currentY}`;
            nodesOnPath.push(route[index + 1]); // Add the next node to the nodesOnPath array

            // Update bounding box
            minX = Math.min(minX, currentX);
            minY = Math.min(minY, currentY);
            maxX = Math.max(maxX, currentX);
            maxY = Math.max(maxY, currentY);
        }
    });

    // Add some padding to the bounding box
    const padding = 10;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;

    // Calculate viewBox to ensure the entire path is visible
    //const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
    //const viewBox = `${currentX} ${currentY} ${currentX - currentX} ${currentY - currentY}`;

        // Calculate viewBox to ensure the entire path is visible
        const calculatedViewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
        //const calculatedViewBox = `${0} ${0} ${500} ${500}`;
        setViewBox(calculatedViewBox);
    
console.log("calculatedViewBox: "+calculatedViewBox);
    
console.log("PathD: "+pathD);


return (
    <svg width={svgWidth} height={svgHeight} viewBox={calculatedViewBox}>
        <path ref={ref} d={pathD} stroke="blue" strokeWidth="3" fill="none" />
        {pathD.split('L').slice(1).map((point, index) => {
            const [x, y] = point.trim().split(' ');
            const shopOrCheckpoint = nodesOnPath[index];
            let name = '';
            if(shopOrCheckpoint.nodeType === "shop"){
                 name = shopOrCheckpoint?.name;
            }
            if(shopOrCheckpoint.nodeType === "floor_change"){
                name = "Stair/Lift";
           }
            return (
                <g key={index}>
                    <circle cx={x} cy={y} r="3" fill="red" />
                    <text x={parseFloat(x) + 5} y={parseFloat(y) + 5} fill="black" fontSize="10">
                        {name}
                    </text>
                </g>
            );
        })}
        <image
    href={pinPoint}
    x={arrowPoint.x - arrowWidth / 2}
    y={arrowPoint.y - arrowHeight / 2}
    height={arrowHeight}
    width={arrowWidth}
    //transform={`rotate(${adjustedAng%180},${arrowPoint.x},${arrowPoint.y})`}
    // transform={`rotate(${angle},${arrowPoint.x},${arrowPoint.y})`}
/>


    </svg>
    
);

});

export default Path;
//<Path route={flattenedRoute} ref={pathRef} setViewBox={setViewBox} stepsWalked={dy} totalSteps={totalSteps}/>