import navigationArrow from "../assets/navigationArrow.svg";
import { useState, useEffect } from "react";
const NavArrow = ({ stepsWalked, totalSteps, pathRef }) => {
    const svgWidth = 400;
    const arrowWidth = 20;
    const arrowHeight = 20;
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        console.log("Path Ref:", pathRef.current);
        if (pathRef.current) {
            console.log("Path Length:", pathRef.current.getTotalLength());
            setPathLength(pathRef.current.getTotalLength());
        }
    }, [pathRef]);
    
    // Calculate the distance along the path based on stepsWalked and totalSteps
    // const pathLength = pathRef.current ? pathRef.current.getTotalLength() : 0;
    const distance = (stepsWalked / totalSteps) * pathLength;

    // Get the point on the path at the calculated distance
    const point = pathRef.current ? pathRef.current.getPointAtLength(distance) : { x: 0, y: 0 };

    console.log("Path Length:", pathLength);
    console.log("Arrow Position:", point);

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