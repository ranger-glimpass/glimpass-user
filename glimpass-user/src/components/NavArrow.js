import navigationArrow from "../assets/navigationArrow.svg";
import { useState, useEffect } from "react";

const NavArrow = ({ stepsWalked = 0, totalSteps, pathRef }) => {
    const arrowWidth = 20;
    const arrowHeight = 20;
    const [point, setPoint] = useState({ x: 0, y: 0 });

    useEffect(() => {
        console.log(pathRef.current);
        if (pathRef.current) {
            // Calculate the distance along the path based on stepsWalked and totalSteps
            const pathLength = pathRef.current.getTotalLength();
            const distance = (stepsWalked / totalSteps) * pathLength;

            // Get the point on the path at the calculated distance
            const calculatedPoint = pathRef.current.getPointAtLength(distance);
            setPoint(calculatedPoint);
        }
    }, [pathRef, stepsWalked, totalSteps]);

    
    console.log("pathref: ",pathRef.current);
console.log("x: ",point.x-arrowWidth/2," y: ",point.y-arrowHeight/2);
    return (
        <image
            href={navigationArrow}
            x={point.x - arrowWidth / 2} // Center the arrow on the point
            y={point.y - arrowHeight / 2}
            height={arrowHeight}
            width={arrowWidth}
        />
    );
};

export default NavArrow;
