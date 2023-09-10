import React, { useState, useEffect, useRef } from 'react';
import navigationArrow from '../assets/navigationArrow.svg';
import '../styles/ShopList.css';
// import shops from '../data/shops';
// import connections from '../data/connections';
import { readStepDetection, inertialFrame } from './helper';




//steps calculation

const Navigation = () => {

    // const location = useLocation();
    // const currentLocation = location.state.currentLocation;
    // const destinationShopId = location.state.destinationShopId;
    const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  const [dx, setdx] = useState(0);
  const [dy, setdy] = useState(0);
  const [directionData, setDirectionData] = useState({});
  const [accelerationData, setAccelerationData] = useState({});
  const [final_speed, setFinalSpeed] = useState(0);
  const [updatedTotalSteps, setTotalSteps] = useState(0);
  const [updateAdjustedAngle, setAdjustedAngle] = useState(0);
    const [alpha, setAlpha] = useState(0);
    const dirRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
    const accRef = useRef();
    const totalAccX = useRef(0);
    const totalAccY = useRef(0);
    const overTime = useRef(0);
    const timeRef = useRef(new Date());
    const distRef = useRef(0);

    const lastRecordedStep = useRef(0);
   
    
    
    //for datapoint 
    var datapoint = 0;
    var degree = "Degree";
  //changes for speed
  const initial_a = useRef(0);
  const intial_speed = useRef(0); 
  const final_s = useRef(0); 
  const d = useRef(0); 
  const prev_force = useRef(0);
  const final_force = useRef(0);
  const final_z = useRef(0);
  const filterdataX_prev = useRef(0);
  const prev_time = useRef(Date.now());
  const prev_time_y = useRef(Date.now());
  const sp_x = useRef(0);
  const sp_y = useRef(0);
  const dist_x = useRef(0);
  const dist_y = useRef(0);
  const final = useRef(0);
  const push = useRef(0);
  const sp_z = useRef(0);
  const steps = useRef(0);
  const push_y = useRef(0);
  const travel = useRef(0);
  const travel_state = useRef(0);
  const temp_angle = useRef(0);
  const prev_angle = useRef(0);
  const omega_a = useRef(0);
  const omega_a_p = useRef(0);
  const omega_max_p = useRef(0);
  const omega_max = useRef(0);
  const lrav_prev = useRef(-1);
  const lrav_now = useRef(0);
  const lrav_push = useRef(0);
  const lrav_final = useRef(0);
  const lrah_prev = useRef(-1);
  const lrah_now = useRef(0);
  const lrah_push = useRef(0);
  const lrah_final = useRef(0);
  const lrov_prev = useRef(-1);
  const lrov_now = useRef(0);
  const lrov_push = useRef(0);
  const lrov_final = useRef(0);
  const lroh_prev = useRef(-1);
  const lroh_now = useRef(0);
  const lroh_push = useRef(0);
  const lroh_final = useRef(0);

    const conn = [
        { name: 'Gucci', category: 'Fashion', description: 'An Italian luxury brand of fashion and leather goods.' },
        { angle: 60, steps: 10 },
        { name: 'Adidas', category: 'Sportswear', discount: 'Up to 50% off', description: 'A global sportswear brand offering athletic footwear and apparel.' },
        { angle: 173, steps: 17 },
        { name: 'Sketchers', category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' }
    ];




    const handleMotion = (event) => {
    
        accRef.current = event.acceleration;
     totalAccX.current += parseInt(event.acceleration.x);
     totalAccY.current += parseInt(event.acceleration.y);
     overTime.current++;
     //const currTime = new Date();
     //milliseconds to second
     const timeInterval = 0
     distRef.current += parseInt(event.acceleration.x) * timeInterval;
     //setDistance(distRef.current);
    // Do stuff with the new orientation data
   //  dirRef.current.alpha = 360-dirRef.current.alpha
    setDirectionData(dirRef.current);
 
     //LowPass filteredData
    //  const filteredDataX = filter(accRef.current.x);
     //const filteredDataY = filter(accRef.current.y);
     //setLowPassY(parseFloat(filteredDataY).toFixed(2));
     
 
     
     
     const acc_th = 0.1 ;
     const omega_th = 10;
     const time_th = 0.3 ; 
     const angle_th = 10 ; 
     const force_th = 10 ;
     const travel_th = 4 ; 
 
     
     
     let accn_x = parseInt(event.acceleration.x)
     if (Math.abs(accn_x) < acc_th ) { accn_x=0;}
     let accn_y = parseInt(event.acceleration.y)
     if (Math.abs(accn_y) < acc_th ) { accn_y=0;}
     let accn_z = parseInt(event.acceleration.z)
     if (Math.abs(accn_z) < acc_th ) { accn_z=0;}
     const sin_a = (parseInt(dirRef.current.alpha))// * (Math.PI / 180))
     const sin_b = (parseInt(dirRef.current.beta))// * (Math.PI / 180))
     const sin_g = (parseInt(dirRef.current.gamma))// * (Math.PI / 180))
     const rate_a = parseInt(event.rotationRate.alpha)
     const rate_b = parseInt(event.rotationRate.beta)
     let rate_c = parseInt(event.rotationRate.gamma)
     const final_omega = inertialFrame(sin_a* (Math.PI / 180),sin_b* (Math.PI / 180),sin_g* (Math.PI / 180),rate_a,rate_b,rate_c)
     rate_c = final_omega[2]
 
     
     //windows.alert(sin_b)
     final.current = inertialFrame(sin_a* (Math.PI / 180),sin_b* (Math.PI / 180),sin_g* (Math.PI / 180),accn_x,accn_y,accn_z)
 
 
     // accn vertical
     if (lrav_prev.current == -1 ) {
       if (final.current[2] < 0 ) {lrav_push.current-=1}
       if (lrav_push.current < -10 ) {lrav_now.current = 1}}
       
     else {
       if (final.current[2] > 0 ) {lrav_push.current+=1}
       if (lrav_push.current > 3 ) {lrav_now.current = -1}}
     lrav_final.current = lrav_prev.current * lrav_now.current
 
     // omega horizontal
     if (lroh_prev.current == -1 ) {
       if (rate_c < 0 ) {lroh_push.current-=1}
       if (lroh_push.current < -10 ) {lroh_now.current = 1}}
       
     else {
       if (rate_c > 0 ) {lroh_push.current+=1}
       if (lroh_push.current > 10 ) {lroh_now.current = -1}}
     lroh_final.current = lroh_prev.current * lroh_now.current
 
     //push implementation
     const timeDiff = (Date.now() - prev_time.current)/1000
     if (final.current[2] > 0) {
       if (push.current<1) {push.current+=0.334}
       if (accn_y < 0 && push_y.current<1 ) {push_y.current+=0.334}
       if (push_y.current>=1 && timeDiff> time_th) {
           push_y.current=1
           travel.current +=1}
       if (travel.current >= travel_th) {travel_state.current = 1}
 
       final_force.current = Math.max(final.current[2], final_force.current)
       omega_max.current = Math.max(Math.abs(rate_c), omega_max.current)
       omega_a.current = Math.max(Math.abs(rate_a), omega_a.current)
 
       if (push.current>=1  && 
           timeDiff> time_th &&
           (push_y.current>=1 ||
           travel_state.current == 1)) {
             if ((omega_max.current < 50 && 
                  omega_max.current > 5 
                  && (lroh_final.current == -1 || lrav_final.current==-1  )
                  ) 
                  //||travel_state.current == 0
                  ) {
                     steps.current+=1 
                     push.current=1
                     prev_time.current = Date.now()
                     lroh_prev.current = lroh_now.current
                     lroh_push.current = 0
                     lrav_prev.current = lrav_now.current
                     lrav_push.current = 0
 
                     if (omega_a.current > 0 ) {omega_a_p.current  = omega_a.current }
                     omega_a.current = 0
 
                     if (omega_max.current > 0 ) {omega_max_p.current  = omega_max.current }
                     omega_max.current = 0
 
                     if (final_force.current > 0 ) {prev_force.current  = final_force.current }
                     final_force.current = 0}
 
             if (omega_max.current > 0 ) {omega_max_p.current  = omega_max.current }
             omega_max.current = 0
         }
     }
 
     if (final.current[2] <= 0 ) {
       push.current-=0.51;
       if (push.current<0) {
         push.current = 0
         push_y.current = 0
         }
     }
 
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 
 
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
     //final_z.current = lr_now.current * lr_prev.current
     sp_x.current=Math.sqrt(prev_force.current*omega_a_p.current*omega_max_p.current)
     setFinalSpeed(final_s.current.toFixed(3));
     setX(parseFloat(lrah_final.current).toFixed(4));
     setY(parseFloat(lrov_final.current).toFixed(4));
     setZ(parseFloat(lroh_final.current).toFixed(4));
     setdx(parseFloat(sp_x.current).toFixed(4));
     setdy(parseFloat(steps.current));
    
 
     
     
   };

   const handleOrientation = (event) => {
    dirRef.current = event;
    const { alpha } = event;
    setAlpha(parseInt(alpha));
};

    useEffect(() => {

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    let route = [];
for (let i = 0; i < conn.length - 1; i += 2) {  // Adjusted the loop condition
    const shop = conn[i];
    const connection = conn[i + 1];
    route.push({ shop, connection });
}

// If the conn array has an odd length, add the last shop without a connection
if (conn.length % 2 !== 0) {
    route.push({ shop: conn[conn.length - 1], connection: null });
}

// const [currentRoute, setCurrentRoute] = useState(route);

// const handleShopClick = (index) => {
//     const newRoute = currentRoute.slice(index);
//     setCurrentRoute(newRoute);

//     // Recalculate the total steps and angle
//     const recalculatedTotalSteps = route.reduce((acc, item) => {
//         if (item.connection) {
//             return acc + item.connection.steps;
//         }
//         return acc;
//     }, 0);

//     const recalculatedNextShopAngle = route[0]?.connection?.angle || 0;
//     const recalculatedAdjustedAngle = (alpha + recalculatedNextShopAngle - 45) % 360;

//     // Update the state or any other necessary variables
//     // For example:
//     // setdy(0);
//     //  setTotalSteps(recalculatedTotalSteps);
//     //  setAdjustedAngle(recalculatedAdjustedAngle);
//     return {a: recalculatedNextShopAngle, b: recalculatedAdjustedAngle};
// };


const [currentRoute, setCurrentRoute] = useState(route);
const [totalStep, setTotalStep] = useState(0);
const [adjustedAng, setAdjustedAng] = useState(0);


useEffect(() => {
    // Initial calculation when the component mounts
    const initialTotalSteps = currentRoute.reduce((acc, item) => {
        if (item.connection) {
            return acc + item.connection.steps;
        }
        return acc;
    }, 0);

    const initialNextShopAngle = currentRoute[0]?.connection?.angle || 0;
    const initialAdjustedAngle = (alpha + initialNextShopAngle - 45) % 360;
    

    setTotalStep(initialTotalSteps);
    setAdjustedAng(initialAdjustedAngle);
    
}, [currentRoute, alpha]);

const handleShopClick = (index) => {
    lastRecordedStep.current = dy;
    const newRoute = currentRoute.slice(index);
    setCurrentRoute(newRoute);

    // The recalculations will be handled by the useEffect above when currentRoute changes
}




    // Compute total steps
    const totalSteps = route.reduce((acc, item) => {
        if (item.connection) {
            return acc + item.connection.steps;
        }
        return acc;
    }, 0);
    const nextShopAngle = route[0]?.connection?.angle || 0;

    //setTotalSteps(totalSteps);

    // Calculate the adjusted angle for the arrow
    // -45 is becuase Navigation arrow is initial 45 NE
    const adjustedAngle = (alpha + nextShopAngle - 45) % 360;
    //setAdjustedAngle(adjustedAngle);
    return (
        
        <div>
            <h2>Navigation to {route[route.length - 1].shop.name}</h2>
            <div>
                <img
                    src={navigationArrow}
                    alt="Navigation Arrow"
                    className="navigation-arrow"
                    // Use the adjusted angle for the rotation
                    style={{ transform: `rotate(${adjustedAng}deg)` }}
                />
            </div>
            <div className="device-Y-container">
        <div>
          <span>steps : </span>
          {dy}
        </div>
      </div>
            <div>
                <h3>Route:</h3>
                {currentRoute.map((item, index) => (
    <div key={index} className="route-item">
        <input 
            type="checkbox" 
            checked={index === 0}  // The first item is always checked as it's the starting point
            onChange={() => handleShopClick(index)} 
        />
        <p>
            {index !== currentRoute.length - 1 ? 
                `${item.shop.name} -> ${currentRoute[index + 1].shop.name} (${item.connection.steps} steps)` 
                : 
                `End at ${item.shop.name}`}
        </p>
    </div>
))}

                <h4>Total Steps: {totalStep - dy + lastRecordedStep.current}</h4>
            </div>
        </div>
    );
}

export default Navigation;


// step = x = 6 + 10 = 16
// total(a+b) = overall - totalcurrentdist

//stepleft = totalcurrentdist - steps 
//stepsLeft = 10-x = 4
//_x = 17 - (steps-(10-stepLeft))
    //  17 - (16-(10-4))

// stepsLeft = currentMax - (steps-((total - currentMax)-stepLeft))
    //          10 - (6-((35-10)-0)) = 29

    //stepleft = totalcurrentdist - steps 

    //x = (0)
    //total = 25  -8 +7

// a -----------10-------------[b]------------17-----------c-------8------d
