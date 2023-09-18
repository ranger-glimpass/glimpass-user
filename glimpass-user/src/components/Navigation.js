import React, { useState, useEffect, useRef } from "react";
import navigationArrow from "../assets/navigationArrow.svg";
import "../styles/ShopList.css";
// import shops from '../data/shops';
// import connections from '../data/connections';
import { inertialFrame } from "./helper";
import ThanksComponent from "../components/Thanks";
import { useNavigate, useLocation } from "react-router-dom";
import MiniMap from '../components/MiniMap';
import Path from '../components/Path';
import NavArrow from '../components/NavArrow';
// import shops from '../data/shops';
import CustomProgressBar from '../components/CustomProgressBar'; // Adjust the path accordingly

// window.stepError = 0;
// window.angleError = 0;
window.currentStep = 0;

//steps calculation

const Navigation = () => {
  const navigate = useNavigate();

  const navigateToShops = (event) => {
    navigate("/shops");
  };




  const pathRef = useRef(null);
  const location = useLocation();
  const currentLocation = location.state.currentLocation;
  const destinationShopId = location.state.destinationShopId;
  // console.log(currentLocation);
  // console.log(destinationShopId);
  const [conn, setConn] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure both currentLocation and destinationShopId are available
    if (currentLocation && destinationShopId) {
      const currDest = JSON.stringify({
        currentNode: currentLocation,
        destinationNode: destinationShopId,
      });
      console.log(currDest);
      const fetchShortestPath = async () => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: currDest,
        };
        try {
          const response = await fetch(
              "https://app.glimpass.com/graph/get-shortest-path",
              requestOptions
          );
          const data = await response.json();
          console.log(data);
          setConn(data); // Assuming the API returns the data in the desired format
          setIsLoading(false); // Set loading to false here
      } catch (error) {
          console.error("Error fetching shortest path:", error);
          setIsLoading(false); // Also set loading to false in case of an error
      }
      
      };

      fetchShortestPath();
    }
  }, [currentLocation, destinationShopId]);

  const [X, setX] = useState(0);
  const [Y, setY] = useState(0);
  const [Z, setZ] = useState(0);
  const [dx, setdx] = useState(0);
  const [dy, setdy] = useState(0);
  const [directionData, setDirectionData] = useState({});
  const [final_speed, setFinalSpeed] = useState(0);

  const [destinationName, setDestinationName] = useState(destinationShopId);
  const [selectedShopStep, setSelectedShopStep] = useState(0);


  const [showPopup, setShowPopup] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const [alpha, setAlpha] = useState(0);
  const dirRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const accRef = useRef();
  const totalAccX = useRef(0);
  const totalAccY = useRef(0);
  const overTime = useRef(0);
  const distRef = useRef(0);
  const offset = useRef(0);

  const lastRecordedStep = useRef(0);

  //changes for speed
  const final_s = useRef(0);
  const prev_force = useRef(0);
  const final_force = useRef(0);
  const prev_time = useRef(Date.now());
  const sp_x = useRef(0);
  const final = useRef(0);
  const push = useRef(0);
  const steps = useRef(0);
  const push_y = useRef(0);
  const travel = useRef(0);
  const travel_state = useRef(0);
  const omega_a = useRef(0);
  const omega_a_p = useRef(0);
  const omega_max_p = useRef(0);
  const omega_max = useRef(0);
  const lrav_prev = useRef(-1);
  const lrav_now = useRef(0);
  const lrav_push = useRef(0);
  const lrav_final = useRef(0);
  const lrah_final = useRef(0);
  const lrov_final = useRef(0);
  const lroh_prev = useRef(-1);
  const lroh_now = useRef(0);
  const lroh_push = useRef(0);
  const lroh_final = useRef(0);

  // const conn = [
  //     { name: 'Gucci', type: 'shop', floor: 0, category: 'Fashion', description: 'An Italian luxury brand of fashion and leather goods.' },
  //     { angle: 60, steps: 6 },
  //     { name: 'JAK', type: 'checkpoint', floor: 0, category: 'Sportswear', discount: 'Up to 50% off', description: 'A global sportswear brand offering athletic footwear and apparel.' },
  //     { angle: 110, steps: 5 },
  //     { name: 'Lift', type: 'floor_change', floor:0 , category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' },
  //     { angle: 42, steps: 7 },
  //     { name: 'MKA', type: 'checkpoint', floor:2, category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' },
  //     { angle: 337, steps: 8 },
  //     { name: 'VVZ', type: 'checkpoint', floor:2,category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' },
  //     { angle: 55, steps: 4 },
  //     { name: 'Spencer', type: 'shop',floor:2, category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' },
  //     { angle: 110, steps: 5 },
  //     { name: 'XYZ', type: 'checkpoint',floor:2, category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' },
  //     { angle: 333, steps: 4 },
  //     { name: 'ABC', type: 'checkpoint',floor:2,category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' },
  //     { angle: 258, steps: 5 },
  //     { name: 'Sketchers', type: 'shop', floor:2,category: 'Footwear', discount: 'Flat 30% off', description: 'An American lifestyle and performance footwear company.' }
  // ];

  const handleMotion = (event) => {
    accRef.current = event.acceleration;
    totalAccX.current += parseInt(event.acceleration.x);
    totalAccY.current += parseInt(event.acceleration.y);
    overTime.current++;
    const timeInterval = 0;
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    setDirectionData(dirRef.current);

    const acc_th = 0.1;
    const time_th = 0.3;
    const travel_th = 4;

    let accn_x = parseInt(event.acceleration.x);
    if (Math.abs(accn_x) < acc_th) {
      accn_x = 0;
    }
    let accn_y = parseInt(event.acceleration.y);
    if (Math.abs(accn_y) < acc_th) {
      accn_y = 0;
    }
    let accn_z = parseInt(event.acceleration.z);
    if (Math.abs(accn_z) < acc_th) {
      accn_z = 0;
    }
    const sin_a = parseInt(dirRef.current.alpha); // * (Math.PI / 180))
    const sin_b = parseInt(dirRef.current.beta); // * (Math.PI / 180))
    const sin_g = parseInt(dirRef.current.gamma); // * (Math.PI / 180))
    const rate_a = parseInt(event.rotationRate.alpha);
    const rate_b = parseInt(event.rotationRate.beta);
    let rate_c = parseInt(event.rotationRate.gamma);
    const final_omega = inertialFrame(
      sin_a * (Math.PI / 180),
      sin_b * (Math.PI / 180),
      sin_g * (Math.PI / 180),
      rate_a,
      rate_b,
      rate_c
    );
    rate_c = final_omega[2];

    //windows.alert(sin_b)
    final.current = inertialFrame(
      sin_a * (Math.PI / 180),
      sin_b * (Math.PI / 180),
      sin_g * (Math.PI / 180),
      accn_x,
      accn_y,
      accn_z
    );

    // accn vertical
    if (lrav_prev.current == -1) {
      if (final.current[2] < 0) {
        lrav_push.current -= 1;
      }
      if (lrav_push.current < -10) {
        lrav_now.current = 1;
      }
    } else {
      if (final.current[2] > 0) {
        lrav_push.current += 1;
      }
      if (lrav_push.current > 3) {
        lrav_now.current = -1;
      }
    }
    lrav_final.current = lrav_prev.current * lrav_now.current;

    // omega horizontal
    if (lroh_prev.current == -1) {
      if (rate_c < 0) {
        lroh_push.current -= 1;
      }
      if (lroh_push.current < -10) {
        lroh_now.current = 1;
      }
    } else {
      if (rate_c > 0) {
        lroh_push.current += 1;
      }
      if (lroh_push.current > 10) {
        lroh_now.current = -1;
      }
    }
    lroh_final.current = lroh_prev.current * lroh_now.current;

    //push implementation
    const timeDiff = (Date.now() - prev_time.current) / 1000;
    if (final.current[2] > 0) {
      if (push.current < 1) {
        push.current += 0.334;
      }
      if (accn_y < 0 && push_y.current < 1) {
        push_y.current += 0.334;
      }
      if (push_y.current >= 1 && timeDiff > time_th) {
        push_y.current = 1;
        travel.current += 1;
      }
      if (travel.current >= travel_th) {
        travel_state.current = 1;
      }

      final_force.current = Math.max(final.current[2], final_force.current);
      omega_max.current = Math.max(Math.abs(rate_c), omega_max.current);
      omega_a.current = Math.max(Math.abs(rate_a), omega_a.current);

      if (
        push.current >= 1 &&
        timeDiff > time_th &&
        (push_y.current >= 1 || travel_state.current == 1)
      ) {
        if (
          omega_max.current < 50 &&
          omega_max.current > 5 &&
          (lroh_final.current == -1 || lrav_final.current == -1)
          //||travel_state.current == 0
        ) {
          steps.current += 1;
          push.current = 1;
          prev_time.current = Date.now();
          lroh_prev.current = lroh_now.current;
          lroh_push.current = 0;
          lrav_prev.current = lrav_now.current;
          lrav_push.current = 0;

          if (omega_a.current > 0) {
            omega_a_p.current = omega_a.current;
          }
          omega_a.current = 0;

          if (omega_max.current > 0) {
            omega_max_p.current = omega_max.current;
          }
          omega_max.current = 0;

          if (final_force.current > 0) {
            prev_force.current = final_force.current;
          }
          final_force.current = 0;
          //   window.angleError = Math.atan(Math.sin(sin_a* (Math.PI / 180))/(window.currentStep-Math.cos(sin_a* (Math.PI / 180))));
          //   window.stepError = Math.sqrt((window.currentStep - Math.cos(sin_a* (Math.PI / 180))) + Math.sin(sin_a* (Math.PI / 180)));
          //   window.stepError = window.currentStep - window.stepError-1;
        }

        if (omega_max.current > 0) {
          omega_max_p.current = omega_max.current;
        }
        omega_max.current = 0;
      }
    }

    if (final.current[2] <= 0) {
      push.current -= 0.51;
      if (push.current < 0) {
        push.current = 0;
        push_y.current = 0;
      }
    }

    sp_x.current = Math.sqrt(
      prev_force.current * omega_a_p.current * omega_max_p.current
    );
    setFinalSpeed(final_s.current.toFixed(3));
    setX(parseFloat(lrah_final.current).toFixed(4));
    setY(parseFloat(lrov_final.current).toFixed(4));
    setZ(parseFloat(lroh_final.current).toFixed(4));
    setdx(parseFloat(sp_x.current).toFixed(4));
    setdy(parseFloat(steps.current));
  };

  const handleOrientation = (event) => {
    dirRef.current = event;
    if (!window.firstTime) {
      offset.current = -1 * parseInt(event.alpha);
      window.firstTime = 1;
    }
    let calibratedAlpha = event.alpha + offset.current;
    if (calibratedAlpha < 0) {
      calibratedAlpha = -1 * calibratedAlpha;
      calibratedAlpha = 360 - calibratedAlpha;
    }
    setAlpha(calibratedAlpha);
  };

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation);
    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, []);

  //conn is where we store {node, connection, node , connection ,....}
  let route = [];
  for (let i = 0; i < conn.length; i++) {
    if (
      conn[i].nodeType === "shop" ||
      conn[i].nodeType === "SHOP" ||
      conn[i].nodeType === "checkpoint" ||
      conn[i].nodeType === "floor_change"
    ) {
      const shopOrCheckpoint = conn[i];
      const connection = conn[i + 1];
      route.push({ shopOrCheckpoint, connection });
      i++; // Increment by one more to skip the connection object
    }
  }

  const getDirection = (targetAngle, alpha) => {
    let angleDifference = ((targetAngle - alpha + 180) % 360) - 180;

    if (angleDifference > 180) angleDifference -= 360;
    if (angleDifference < -180) angleDifference += 360;

    if (angleDifference >= -10 && angleDifference <= 10) return "straight";
    if (angleDifference > 10 && angleDifference <= 45) return "slightly right";
    if (angleDifference > 45 && angleDifference <= 135) return "sharp right";
    if (angleDifference < -10 && angleDifference >= -45) return "slightly left";
    if (angleDifference < -45 && angleDifference >= -135) return "sharp left";
    return "U-turn";
  };

  // If the conn array has an odd length, add the last shop without a connection
  // If the conn array has an odd length and the last element is a connection, add the last shop without a connection
  // if (conn.length % 2 !== 0 && conn[conn.length - 1].type !== 'shop') {
  //     route.push({ shopOrCheckpoint: conn[conn.length - 1], connection: null });
  // }

  const [currentRoute, setCurrentRoute] = useState(route);
  const [totalStep, setTotalStep] = useState(0);
  const [adjustedAng, setAdjustedAng] = useState(0);

  useEffect(() => {
    //window.currentStep = currentRoute[0].connection.steps;
    const initialTotalSteps = currentRoute.reduce((acc, item) => {
      if (item.connection) {
        return acc + parseInt(item.connection.steps);
      }
      return acc;
    }, 0);

    const initialNextShopAngle = currentRoute[0]?.connection?.angle || 0;
    const initialAdjustedAngle = (alpha + initialNextShopAngle - 45) % 360;
    setTotalStep(initialTotalSteps);
    setAdjustedAng(initialAdjustedAngle);
  }, [currentRoute, alpha]);

  const handleShopClick = (index) => {
    // lastRecordedStep.current = dy;
    // const newRoute = currentRoute.slice(index);
    // setCurrentRoute(newRoute);
    // if(currentRoute[0]?.shopOrCheckpoint?.name)
    setCurrentRoute((prevRoute) => prevRoute.slice(1));
    lastRecordedStep.current = dy; // Reset the step count
    setShowPopup(false);
    // The recalculations will be handled by the useEffect above when currentRoute changes

    // Check if the user has reached the last stop
    if (currentRoute.length === 1) {
      setShowThanks(true);
    }
  };

  useEffect(() => {
    // Check if you've reached the next destination
    const stepsToNextShop = currentRoute[0]?.connection?.steps || 0;

    if (dy - lastRecordedStep.current >= stepsToNextShop) {
      setShowPopup(true);
    }
  }, [dy, currentRoute]);

  const handleDropdownChange = (selectedShopName) => {
    const selectedIndex = route.findIndex(item => item.shopOrCheckpoint.name === selectedShopName);
    setCurrentRoute(route.slice(selectedIndex));

    // Calculate the total steps up to the selected shop/checkpoint
    let stepsUpToSelectedShop = 0;
    for (let i = 0; i < selectedIndex; i++) {
        if (route[i].connection) {
            stepsUpToSelectedShop += route[i].connection.steps;
        }
    }

    // Update the stepsWalked state
    setSelectedShopStep(stepsUpToSelectedShop);
};


  // Compute total steps
  const totalSteps = route.reduce((acc, item) => {
    if (item.connection) {
      return acc + parseInt(item.connection.steps);
    }
    return acc;
  }, 0);
  const nextShopAngle = route[0]?.connection?.angle || 0;

  //setTotalSteps(totalSteps);

  // Calculate the adjusted angle for the arrow
  // -45 is becuase Navigation arrow is initial 45 NE
  const adjustedAngle = (alpha + nextShopAngle - 45) % 360;
  //setAdjustedAngle(adjustedAngle);

  const [remainingSteps, setRemainingSteps] = useState(
    currentRoute[0]?.connection?.steps || 0
  );

  const dyPrevious = useRef(dy);

  // Handle decrementing of remainingSteps based on dy
  useEffect(() => {
    // Calculate the difference in steps since the last update
    const stepsTaken = dy - dyPrevious.current;

    // Update the remaining steps
    setRemainingSteps((prevSteps) => Math.max(0, prevSteps - stepsTaken));

    // Update the previous dy value for the next calculation
    dyPrevious.current = dy;
  }, [dy]);

  // Reset remaining steps when the current route changes
  useEffect(() => {
    if (currentRoute[0]) {
      setRemainingSteps(currentRoute[0].connection?.steps || 0);
    }
  }, [currentRoute]);

  const directionsAndShops = route.reduce((acc, item, index) => {
    if (item.shopOrCheckpoint.nodeType === "shop") {
      acc.push(item.shopOrCheckpoint);
    } else if (item.connection) {
      acc.push({
        direction: getDirection(item.connection.angle, dy),
        steps: item.connection.steps,
      });
    }
    return acc;
  }, []);

  const totalStepsBetweenShops = directionsAndShops.reduce((acc, item) => {
    if (item.steps) {
      return acc + parseInt(item.steps);
    }
    return acc;
  }, 0);

  // Prepare the data for the CustomProgressBar
  const shopsData = route.map((item, index) => {
    const progressToThisPoint = route
      .slice(0, index + 1)
      .reduce((acc, curr) => acc + (curr.connection?.steps || 0), 0);
    return {
      name: item.shopOrCheckpoint.name,
      step: progressToThisPoint,
    };
  });

  let flattenedRoute = [];
route.forEach(item => {
  flattenedRoute.push(item.shopOrCheckpoint);
  if (item.connection) {
    flattenedRoute.push(item.connection);
  }
});



return isLoading ? (
  <div className="loader">Loading...</div> // Replace with your loader component or style
) : ( showThanks ? (
    <ThanksComponent
      route={directionsAndShops}
      stepsWalked={dy}
      totalSteps={totalSteps}
    />
  ) : (
    <div>
      <button className="shop-button" onClick={navigateToShops}>
        Navigate other shops
      </button>
      {/* <CustomProgressBar 
    totalSteps={totalSteps} 
    stepsWalked={dy - selectedShopStep} 
    shops={shopsData} 
/> */}
{/* <MiniMap totalSteps={totalSteps} stepsWalked={selectedShopStep} route={route} /> */}
<svg width="400" height="400" viewBox="0 0 400 400" style={{border: '1px solid red'}}>
  <Path route={flattenedRoute} ref={pathRef} />
  <NavArrow stepsWalked={dy} totalSteps={totalSteps} pathRef={pathRef} />
</svg>


      <div className="current-location">
        <h3>In between</h3>
        <ul className="shop-list">
          {route
            // .filter((item) => item.shopOrCheckpoint.nodeType === "shop") // Filter out only shops
            .map((item, index) => (
              <li
                key={index}
                className={
                  currentRoute[0]?.shopOrCheckpoint?.name ===
                  item.shopOrCheckpoint?.name
                    ? "active-shop"
                    : ""
                }
                onClick={() =>
                  handleDropdownChange(item.shopOrCheckpoint?.name)
                }
              >
                {currentRoute[0]?.shopOrCheckpoint?.name ===
                  item.shopOrCheckpoint?.name && "📍 "}
                {item.shopOrCheckpoint?.name}
              </li>
            ))}
        </ul>
      </div>
      {/* route[route.length - 1].shopOrCheckpoint.name */}
      <h2>Navigation to {destinationName}</h2>
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
        <div className="route-container">
          {currentRoute.slice(0, 2).map((item, index) => (
            <div key={index} className="route-item">
              <h3>
                {index === 0 ? (
                  <span>📍 Now at: {item.shopOrCheckpoint?.name}</span>
                ) : item.shopOrCheckpoint?.type === "shop" ? (
                  <span>👉 Next shop: {item.shopOrCheckpoint?.name}</span>
                ) : (
                  <span>
                    Take {getDirection(item.connection?.angle, dy)} in next{" "}
                    {remainingSteps} steps
                  </span>
                )}
              </h3>
              {index === 0 &&
              currentRoute[1] &&
              currentRoute[1].shopOrCheckpoint?.nodeType === "shop" ? (
                <p>
                  {remainingSteps} steps to{" "}
                  {currentRoute[1].shopOrCheckpoint?.name}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {showPopup && (
          <div className="popup">
            <p>
              {currentRoute[0]?.shopOrCheckpoint.nodeType === "floor_change"
                ? `Please proceed to the lift and go to floor ${currentRoute[1]?.shopOrCheckpoint.floor}.`
                : currentRoute[1]?.shopOrCheckpoint.nodeType === "checkpoint"
                ? `Take a turn ${getDirection(
                    currentRoute[1]?.connection?.angle,
                    dy
                  )}.`
                : `Take a turn ${getDirection(
                    currentRoute[1]?.connection?.angle,
                    dy
                  )}.\nDid you reach ${
                    currentRoute[1]?.shopOrCheckpoint.name
                  }?`}
            </p>
            <button onClick={handleShopClick}>Yes</button>
            <button onClick={() => setShowPopup(false)}>No</button>
          </div>
        )}

        <h4>
          Total Steps: {Math.max(0, totalStep - dy + lastRecordedStep.current)}
        </h4>
      </div>
    </div>
  ));
};

export default Navigation;
