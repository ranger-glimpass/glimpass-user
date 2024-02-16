import React, { useState, useEffect, useRef } from "react";
import CustomProgressBar from "../components/CustomProgressBar";
import NavigationButtons from "./NavigationButtons";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SvgIcon,
  useTheme,
} from "@mui/material";

import "../styles/ShopList.css";
import { inertialFrame } from "./helper";
import ThanksComponent from "../components/Thanks";
import { useNavigate, useLocation } from "react-router-dom";
import Path from "../components/Path";
import LiftStairs from "../assets/LiftStairs.png";
import OutsideLift from "../assets/OutsideLift.png";
import CountdownButton from "./CountdownButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingSpinner from "./LoadingSpinner";
import arrowTorch from "../assets/arrowTorch.png";
import reCalibrate from "../assets/reCalibrate.png";
import areULost from "../assets/areULost.png";
import ReRouting from "./ReRouting";

import RouteSummary from "./RouteSummary";

window.currentStep = 0;
window.modifyDy = 1;

//steps calculation

const globalArray = [];
const globalTimeArray = [];

const Navigation = () => {
  const navigate = useNavigate();

  const navigateToShops = event => {
    window.location.href = "/markets";
  };

  const scaleFactor = 3;

  const pathRef = useRef(null);
  const location = useLocation();
  const currentLocation = location.state.currentLocation;
  const calibratedShopAngle = location.state?.calibratedShopAngle || 0;
  const destinationShopId = location.state.destinationShopId;
  const endNodesList = location.state.endNodesList;
  const [conn, setConn] = useState([]);
  const [route, setRoute] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(route);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshed, setIsRefreshed] = useState(true);
  const [turnAngle, setTurnAngle] = useState(false);
  const [showFloorChangePopup, setShowFloorChangePopup] = useState(false);
  const [nextFloor, setNextFloor] = useState(null);
  const [previousNodeName, setPreviousNodeName] = useState(null);
  const [selectedShopCoords, setSelectedShopCoords] = useState(null);
  const [nodeSelected, setNodeSelected] = useState(false);

  const [destinationName, setDestinationName] = useState(destinationShopId);
  const [stepsWalked, setStepsWalked] = useState(0);
  const [selectedShopIndex, setSelectedShopIndex] = useState(0);

  const [showMap, setShowMap] = useState(false);
  const changeSlectedIndexDynamic = index => {
    console.log(index, "manish");
    setSelectedShopIndex(index);
  };
  // useEffect(() => {
  //   // Check if the page was loaded via a refresh
  //   if (
  //     window.performance &&
  //     window.performance.navigation.type ===
  //       window.performance.navigation.TYPE_RELOAD
  //   ) {
  //     // Redirect to the shops page
  //     console.log("refreshed!!!!!!!!!!!!!!!!");
  //     window.location.href = "/markets";
  //   }
  // }, []);

  useEffect(() => {
    // Ensure both currentLocation and destinationShopId are available
    if (currentLocation && destinationShopId) {
      const currDest = JSON.stringify({
        currentNode: currentLocation,
        destinationNode: destinationShopId,
        endNodesList: endNodesList,
      });
      console.log(currDest, "currDest");
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

          // Check if the data is empty or not in the desired format
          if (!data || data.length === 0) {
            alert("No route found!");
            navigate("/markets"); // Assuming '/markets' is the route for the market page
            return;
          }

          setConn(data); // Assuming the API returns the data in the desirrerouteeled format
          console.log(data, "shortest path");

          const lastShop = conn[conn.length - 1]?.name;
          setDestinationName(lastShop);

          // Find the first shop and set it as the active shop
          const firstShop = data.find(
            item => item.shopOrCheckpoint?.type === "shop" || item.shopOrCheckpoint?.type==="camera" || item.shopOrCheckpoint?.type==="qrCode"
          );
          if (firstShop) {
            setCurrentRoute([firstShop]);
          }

          setIsRefreshed(true);

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
  const [dyV2, setDyV2] = useState(0);
  const [directionData, setDirectionData] = useState({});
  const [final_speed, setFinalSpeed] = useState(0);

  const [selectedShopStep, setSelectedShopStep] = useState(0);

  const [showPopup, setShowPopup] = useState(false);
  const [showThanks, setShowThanks] = useState(false);

  const [alpha, setAlpha] = useState(0);
  const [testAlpha, setTestAlpha] = useState(0);
  const [aa, setAa] = useState(0);
  const dirRef = useRef({ alpha: 0, beta: 0, gamma: 0 });
  const accRef = useRef();
  const totalAccX = useRef(0);
  const totalAccY = useRef(0);
  const overTime = useRef(0);
  const distRef = useRef(0);
  const offset = useRef(0);
  const straightPath = useRef(false);
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
  const stepsV2 = useRef(0);
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

  const reachRef = useRef(0);
  const whereRef = useRef("nowhere");

  const handleMotion = event => {
    accRef.current = event.acceleration;
    totalAccX.current += parseInt(event.acceleration.x);
    totalAccY.current += parseInt(event.acceleration.y);
    overTime.current++;
    const timeInterval = 0;
    distRef.current += parseInt(event.acceleration.x) * timeInterval;
    setDirectionData(dirRef.current);

    const acc_th = 0.1;
    const time_th = 0.4;
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
          steps.current += window.modifyDy;
          stepsV2.current += 1;
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
    setDyV2(parseFloat(steps.current));
  };

  const handleOrientation = event => {
    dirRef.current = event;
    setAa(event.alpha);
    if (!window.firstTime) {
      offset.current = -1 * parseInt(event.alpha);
      window.firstTime = 1;
    }
    let calibratedAlpha = parseInt(event.alpha) + offset.current; // calibratedalpha==0
    calibratedAlpha = (360 + calibratedAlpha) % 360;
    setTestAlpha(calibratedAlpha); //2
    // calibratedAlpha = (360 - calibratedAlpha - calibratedShopAngle) % 360;
    setAlpha(calibratedAlpha);
  };

  const configureDeviceSensors = flag => {
    if (flag) {
      // console.log("hello");
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("devicemotion", handleMotion);
    } else {
      // console.log("hi");
      delete window.firstTime;
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("devicemotion", handleMotion);
    }
  };

  useEffect(() => {
    configureDeviceSensors(true);
    return () => {
      configureDeviceSensors(false);
    };
  }, []);

  //conn is where we store {node, connection, node , connection ,....}

  useEffect(() => {
    let tempRoute = [];
    for (let i = 0; i < conn.length; i++) {
      if (
        conn[i].nodeType === "shop" ||
        conn[i].nodeType === "washroom" ||
        conn[i].nodeType === "checkpoint" ||
        conn[i].nodeType === "camera" ||
        conn[i].nodeType === "qrCode" ||
        conn[i].nodeType === "floor_change" ||
        conn[i].nodeType === "floor_change_lift" 
      ) {
        const shopOrCheckpoint = conn[i];
        const connection = conn[i + 1];
        if (i + 2 < conn.length) {
          connection.steps = connection.steps - conn[i + 2]?.nodeWeight;
        }
        console.log(connection, "manishhh");
        tempRoute.push({ shopOrCheckpoint, connection });
        i++; // Increment by one more to skip the connection object
      }
    }
    setRoute(tempRoute);
  }, [conn]);

  console.log(conn, "conn");
  console.log(route, "route");
  // const getDirection = (targetAngle, alpha) => {
  //   let angleDifference = ((targetAngle - alpha + 180) % 360) - 180;

  //   if (angleDifference > 180) angleDifference -= 360;
  //   if (angleDifference < -180) angleDifference += 360;

  //   if (angleDifference >= -10 && angleDifference <= 10) return "straight";
  //   if (angleDifference > 10 && angleDifference <= 45) return "slightly right";
  //   if (angleDifference > 45 && angleDifference <= 135) return "sharp right";
  //   if (angleDifference < -10 && angleDifference >= -45) return "slightly left";
  //   if (angleDifference < -45 && angleDifference >= -135) return "sharp left";
  //   return "U-turn";
  // };

  // If the conn array has an odd length, add the last shop without a connection
  // If the conn array has an odd length and the last element is a connection, add the last shop without a connection
  // if (conn.length % 2 !== 0 && conn[conn.length - 1].type !== 'shop') {
  //     route.push({ shopOrCheckpoint: conn[conn.length - 1], connection: null });
  // }

  const [totalStep, setTotalStep] = useState(0);
  const [adjustedAng, setAdjustedAng] = useState(0);
  const [nextNodeAngle, setNextNodeAngle] = useState(0);
  const [currentWalkAngle, setCurrentWalkAngle] = useState(0);
  const [showReachedPopup, setShowReachedPopup] = useState(false);

  useEffect(() => {
    const initialTotalSteps = currentRoute.reduce((acc, item) => {
      if (item.connection) {
        return acc + parseInt(item.connection.steps);
      }
      return acc;
    }, 0);

    const stepsToNextShop = currentRoute[0]?.connection?.steps || 1000000;
    if (dy - lastRecordedStep.current >= stepsToNextShop) {
      let initialNextShopAngle = currentRoute[1]?.connection?.angle || 0;
      // initialNextShopAngle = 360 - initialNextShopAngle;
      // const initialAdjustedAngle = (alpha + initialNextShopAngle - 45) % 360;
      // initialNextShopAngle =
      //   (360 + initialNextShopAngle + calibratedShopAngle) % 360;
      let initialAdjustedAngle =
        (360 - alpha + initialNextShopAngle - calibratedShopAngle) % 360;

      setAdjustedAng(initialAdjustedAngle);
    } else {
      let initialNextShopAngle = currentRoute[0]?.connection?.angle || 0;
      // initialNextShopAngle = 360 - initialNextShopAngle;
      //const initialAdjustedAngle = (alpha + initialNextShopAngle - 45) % 360;
      // initialNextShopAngle =
      //   (360 + initialNextShopAngle + calibratedShopAngle) % 360;
      let initialAdjustedAngle =
        (360 - alpha + initialNextShopAngle - calibratedShopAngle) % 360;
      // initialAdjustedAngle = 360 - initialAdjustedAngle;

      setAdjustedAng(initialAdjustedAngle);
    }

    setTotalStep(initialTotalSteps);
    setCurrentWalkAngle(currentRoute[0]?.connection?.angle || 0);
    setNextNodeAngle(currentRoute[1]?.connection?.angle || 0);
  }, [currentRoute, alpha, route]);

  useEffect(() => {
    if (currentRoute.length === 1) {
      setShowReachedPopup(true);
    }
    globalArray.push((alpha + calibratedShopAngle) % 360);
    globalTimeArray.push(new Date().getSeconds());

    const len = globalArray.length;
    if (len > 3) {
      const averageAngle =
        (globalArray[len - 1] + globalArray[len - 2] + globalArray[len - 3]) /
        3;

      const timeDiffInterval =
        (60 + globalTimeArray[len - 3] - globalTimeArray[len - 1]) % 60;
      const percentageError = 20;

      let angleDiff = Math.abs(currentWalkAngle - nextNodeAngle);
      let angleDiff2 = Math.abs(360 - angleDiff);
      angleDiff = Math.min(angleDiff, angleDiff2);
      straightPath.current = angleDiff <= percentageError;

      if (
        averageAngle >= currentWalkAngle - percentageError &&
        averageAngle <= currentWalkAngle + percentageError
      ) {
        // true walking in right direction;
        reachRef.current = averageAngle;
        whereRef.current = "staright walk path";
      } else if (
        averageAngle >= nextNodeAngle - percentageError &&
        averageAngle <= nextNodeAngle + percentageError &&
        timeDiffInterval >= 1
      ) {
        // turns or not
        // signal to path.js
        setTurnAngle(true);
        reachRef.current = averageAngle;
        whereRef.current = "moved to next shop angle";
      } else {
        reachRef.current = averageAngle;
        whereRef.current = "walking somewhere else";
      }
    }
  }, [stepsV2.current]);
  // manish


  const floorPopupfn = () => {
    const currentIndex = currentRoute.findIndex(
      item => item.shopOrCheckpoint.nodeType === "floor_change" || item.shopOrCheckpoint.nodeType === "floor_change_lift"
    );
  
    if (currentIndex === -1) {
      setShowFloorChangePopup(false);
      return;
    }
  
    const previousNode = currentIndex > 0 ? currentRoute[currentIndex - 1]?.shopOrCheckpoint : null;
    let nextNode = currentRoute[currentIndex + 1]?.shopOrCheckpoint;
  
    let j = currentIndex + 1;
    while (j < currentRoute.length && nextNode?.nodeType === "checkpoint") {
      nextNode = currentRoute[j]?.shopOrCheckpoint;
      j++;
    }
  
    if (previousNode && nextNode && previousNode.floor !== nextNode.floor) {
      setShowFloorChangePopup(true);
      setNextFloor(nextNode?.floor);
      setPreviousNodeName(previousNode?.name);
    } else {
      setShowFloorChangePopup(false);
    }
  };
  


  useEffect(() => {
    // Check if you've reached the next destination
    const stepsToNextShop = currentRoute[0]?.connection?.steps || 1000000;

    if (dy - lastRecordedStep.current >= stepsToNextShop && turnAngle) {
      // If it's the last shop in the route
      window.modifyDy = 1;
      setTurnAngle(false);
      setCurrentRoute(prevRoute => prevRoute.slice(1));
      lastRecordedStep.current = dy; // Reset the step count
    } else if (dy - lastRecordedStep.current >= stepsToNextShop) {
      floorPopupfn();
      if (currentRoute.length === 2) {
        setCurrentRoute(prevRoute => prevRoute.slice(1));
      } else if (currentRoute.length == 1) {
        setShowReachedPopup(true);
      }

      window.modifyDy = 0;
      setTurnAngle(false);
      if (straightPath.current) {
        reachRef.current = 0;
        whereRef.current = "we are inside staright path condition";
        setTurnAngle(true);
      }
    } else if (turnAngle) {
      window.modifyDy = stepsToNextShop - (dy - lastRecordedStep.current);
    }

    // setCurrentShop(currentRoute[0].shopOrCheckpoint?.name);
  }, [dy, currentRoute, turnAngle]);

  const handleDropdownChange = selectedShopName => {
    console.log(selectedShopName, "test");
    const selectedIndex = route.findIndex(
      item => item.shopOrCheckpoint.nodeId === selectedShopName
    );
    setCurrentRoute(route.slice(selectedIndex));
    console.log(currentRoute, "test t");
    // If the first shop is selected, set the coordinates to (200, 200)
    if (selectedIndex === 0) {
      setSelectedShopCoords({ x: 200, y: 200 });

      setNodeSelected(true);
      return;
    }

    // Calculate the coordinates for the selected shop
    let currentX = 200; // Starting at the center
    let currentY = 200;
    for (let i = 0; i < selectedIndex; i++) {
      // Note: < selectedIndex, not <=
      if (route[i].connection) {
        const angle = route[i].connection.angle;
        const steps = route[i].connection.steps * scaleFactor;
        const dx = steps * Math.cos((angle * Math.PI) / 180);
        const dy = steps * Math.sin((angle * Math.PI) / 180);
        currentX += dx;
        currentY += dy;
      }
    }

    // Update the selectedShopCoords state
    setSelectedShopCoords({ x: currentX, y: currentY });

    // Calculate the total steps up to the selected shop/checkpoint
    let stepsUpToSelectedShop = 0;
    for (let i = 0; i < selectedIndex; i++) {
      if (route[i].connection) {
        stepsUpToSelectedShop += route[i].connection.steps;
      }
    }

    // Update the stepsWalked state
    setSelectedShopStep(stepsUpToSelectedShop);

    setNodeSelected(true);

    // Reset stepsWalked and set the selected shop index
    setStepsWalked(0);
    const index = route.findIndex(
      item => item.shopOrCheckpoint.nodeId === selectedShopName
    );
    console.log(index, "test t");
    setSelectedShopIndex(index);
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
    setRemainingSteps(prevSteps => Math.max(0, prevSteps - stepsTaken));

    // Update the previous dy value for the next calculation
    dyPrevious.current = dy;
  }, [dy]);

  // Reset remaining steps when the current route changes
  useEffect(() => {
    if (currentRoute[0]) {
      setRemainingSteps(currentRoute[0].connection?.steps || 0);
    }

    // setCurrentShop(currentRoute[0].shopOrCheckpoint?.name);
  }, [currentRoute]);

  // const directionsAndShops = route.reduce((acc, item, index) => {
  //   if (item.shopOrCheckpoint.nodeType === "shop") {
  //     acc.push(item.shopOrCheckpoint);
  //   } else if (item.connection) {
  //     acc.push({
  //       direction: getDirection(item.connection.angle, dy),
  //       steps: item.connection.steps,
  //     });
  //   }
  //   return acc;
  // }, []);

  // const totalStepsBetweenShops = directionsAndShops.reduce((acc, item) => {
  //   if (item.steps) {
  //     return acc + parseInt(item.steps);
  //   }
  //   return acc;
  // }, 0);

  // Prepare the data for the CustomProgressBar
  const shopsData = route.map((item, index) => {
    const progressToThisPoint = route
      .slice(0, index + 1)
      .reduce(
        (acc, curr) =>
          acc + (curr.connection ? parseInt(curr.connection.steps, 10) : 0),
        0
      );

    const anglesIn = route
      .slice(0, index + 1)
      .reduce(
        (acc, curr) =>
          curr.connection ? parseInt(curr.connection.angle, 10) : 0,
        0
      );
    return {
      name: item.shopOrCheckpoint.name,
      nodeType: item.shopOrCheckpoint.nodeType,
      floor: item.shopOrCheckpoint.floor,
      step: progressToThisPoint,
      anglesIn: anglesIn,
    };
  });
  const resetSteps = index => {
    if (index === 0) {
      steps.current = 0;
      stepsV2.current = 0;
      setdy(0);
      lastRecordedStep.current = 0;
    } else {
      const modifySteps = shopsData[index - 1].step;
      steps.current = modifySteps;
      stepsV2.current = modifySteps;
      setdy(modifySteps);
      lastRecordedStep.current = modifySteps;
    }
  };

  useEffect(() => {
    resetSteps(selectedShopIndex);
    // Calculate the coordinates for the selected shop
    let currentX = 200; // Starting at the center
    let currentY = 200;
    for (let i = 0; i < selectedShopIndex; i++) {
      // Note: < selectedIndex, not <=
      if (route[i].connection) {
        const angle = route[i].connection.angle;
        const steps = route[i].connection.steps * scaleFactor;
        const dx = steps * Math.cos((angle * Math.PI) / 180);
        const dy = steps * Math.sin((angle * Math.PI) / 180);
        currentX += dx;
        currentY += dy;
      }
    }

    // Update the selectedShopCoords state
    setSelectedShopCoords({ x: currentX, y: currentY });
  }, [selectedShopIndex, route]);

  let flattenedRoute = [];
  route.forEach(item => {
    flattenedRoute.push(item.shopOrCheckpoint);
    if (item.connection) {
      flattenedRoute.push(item.connection);
    }
  });

  //console.log("routeF: ",flattenedRoute)

  const [viewBox, setViewBox] = useState("0 0 500 300");

  useEffect(() => {
    if (isRefreshed && route.length > 0) {
      handleDropdownChange(route[0].shopOrCheckpoint?.nodeId);
      setIsRefreshed(false); // Reset isRefreshed to false after handling
    }

    // setCurrentShop(route[0].shopOrCheckpoint?.name);
  }, [isRefreshed, route, handleDropdownChange]);

  // const [xyz, setXyz] = useState(0);
  // const addXYZ = () =>{
  //   setXyz(xyz+1);
  // }
  // console.log(xyz,"xyz");

  //Devashish's floor_change popup function
  // useEffect(() => {
  //   const currentNodeType = currentRoute[0]?.shopOrCheckpoint?.nodeType;
  //   let nextNode = currentRoute[1]?.shopOrCheckpoint;
  //   let j = 1;
  //   while (j < currentRoute.length && nextNode?.nodeType === "checkpoint") {
  //     nextNode = currentRoute[j]?.shopOrCheckpoint;
  //     j++;
  //   }
  //   if (currentNodeType === "floor_change" && nextNode) {
  //     setShowFloorChangePopup(true);
  //     setNextFloor(nextNode?.floor);
  //   } else {
  //     setShowFloorChangePopup(false);
  //   }
  // }, [currentRoute]);

  console.log(shopsData, "shopdata");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentStep, setCurrentStep] = useState(1);

  // Function to toggle the map view
  const toggleShowMap = () => {
    setShowMap(!showMap);
  };

  // Button label based on the showMap state
  const showMapButton = showMap ? "Hide Map" : "Show Map";

  const reRouteEle = [
    {
      type: areULost,
      action: () => {
        navigate("/dashboard", {
          state: {
            destinationShopId,
            endNodesList: endNodesList,
            market: location.state?.market,
          },
        });
      },
    },
    {
      type: reCalibrate,
      action: () => {
        configureDeviceSensors(false);
        setTimeout(() => {
          window.alert("we are re configured");
          configureDeviceSensors(true);
        }, 3000);
      },
    },
    // Add more icons as needed
  ];

  return isLoading ? (
    <div
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
    >
      {/* Replace CircularProgress with your custom spinner */}
      <div>
        <LoadingSpinner />
      </div>
      <h3>Hang On!</h3>
      <h4>Finding shortest path...</h4>
    </div>
  ) : showThanks ? (
    <ThanksComponent
      // route={directionsAndShops}
      stepsWalked={dy}
      totalSteps={totalSteps}
    />
  ) : (
    <>
      {" "}
      {/* <ThanksComponent
      route={directionsAndShops}
      stepsWalked={dy}
      totalSteps={totalSteps}
    /> */}
      <ReRouting icons={reRouteEle} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          padding: isMobile ? "10px" : "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <div>
            {" "}
            <Typography
              variant="h6"
              gutterBottom
              style={{ textAlign: "center", flexGrow: 1 }}
            >
              {/* Navigation to {destinationName} */}
            </Typography>
          </div>
          <br></br>
          {/* <div
            style={{ cursor: "pointer" }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Typography variant="h6">
              📍 {currentRoute[0]?.shopOrCheckpoint?.name || "In between"}
            </Typography>

            {/* {isDropdownOpen && (
              <List>
                {route.map((item, index) => (
                  <ListItem
                    key={index}
                    button
                    selected={
                      currentRoute[0]?.shopOrCheckpoint?.name ===
                      item.shopOrCheckpoint?.name
                    }
                    onClick={() => {
                      handleDropdownChange(item.shopOrCheckpoint?.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <ListItemText primary={item.shopOrCheckpoint?.name} />
                  </ListItem>
                ))}
              </List>
            )} 
          </div>*/}
        </div>

        <div style={{ marginTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              steps.current++;
              stepsV2.current++;
              setdy(steps.current);
            }}
          >
            Add steps mannualy
          </Button>
        </div>

        <CustomProgressBar
          shops={shopsData}
          stepsWalked={dy}
          totalSteps={totalSteps}
          adjustedAng={adjustedAng}
          selectedShopIndex={selectedShopIndex}
        />

        <div>
          <NavigationButtons
            route={route}
            currentRoute={currentRoute}
            handleDropdownChange={handleDropdownChange}
            changeSlectedIndexDynamic={changeSlectedIndexDynamic}
          />
        </div>
        <div style={{ marginBottom: "10px", marginTop: "30px" }}>
          <img
            src={arrowTorch} //{navigationArrow}
            alt="Navigation Arrow"
            style={{
              transform: `rotate(${360 - adjustedAng}deg)`,
              width: "244px",
              height: "278px",
              margin: "10px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            borderTop: "1px solid #ddd",
          }}
        >
          {/* <div>
            <p>{turnAngle ? "Trueeee" : "Falseeee"}</p>
            <p>device raw alhpa value{aa?.toFixed(4)}</p>
            <p>after calibrated value{alpha}</p>
            <p>
              user average current walking angle {reachRef.current?.toFixed(4)}
            </p>
            <p>where code is executing {whereRef.current}</p>
            <p>user need to walk in this angle{currentWalkAngle}</p>
            <p>next node angle in route{nextNodeAngle}</p>
            <p>angle to be shown on arrow {adjustedAng}</p>
            <p>shop angle is {calibratedShopAngle}</p>
            <p>user steps{steps.current}</p>
            <p>user actual steps{stepsV2.current}</p>
            <p>is walking : {window.modifyDy}</p>
          </div> */}

          <RouteSummary
            shops={shopsData}
            selectedShopIndex={selectedShopIndex}
          />

          <button onClick={toggleShowMap}>{showMapButton}</button>
          <div
            style={{
              transition: "opacity 2s ease",
              opacity: showMap ? 1 : 0,
              height: showMap ? "auto" : 0,
              overflow: "hidden",
            }}
          >
            {showMap && (
              <div
                style={{
                  flexGrow: 1,
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginBottom: "20px",
                }}
              >
                <SvgIcon
                  viewBox="0 0 500 400"
                  style={{
                    width: "80%",
                    height: "100%",
                  }}
                >
                  <Path
                    route={flattenedRoute}
                    ref={pathRef}
                    setViewBox={setViewBox}
                    stepsWalked={dy}
                    totalSteps={totalSteps}
                    adjustedAng={adjustedAng}
                    selectedShopCoords={selectedShopCoords}
                    nodeSelected={nodeSelected}
                    setNodeSelected={setNodeSelected}
                  />
                </SvgIcon>
              </div>
            )}
          </div>
          {/* <Typography variant="body1" style={{ fontWeight: "bold", marginBottom: '10px' }}>
        Steps: {dy}
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        Total Steps: {Math.max(0, totalStep - dy + lastRecordedStep.current)}
      </Typography> */}
          <Button variant="contained" color="primary" onClick={navigateToShops}>
            Navigate other shops
          </Button>
        </div>

        {/* ... your Dialog components */}
        {showReachedPopup && (
          <Dialog
            open={showReachedPopup}
            onClose={() => setShowReachedPopup(false)}
          >
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Did you reach {currentRoute[0]?.shopOrCheckpoint?.name}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setShowReachedPopup(false)}
                color="primary"
              >
                No
              </Button>
              <Button
                onClick={() => {
                  setShowReachedPopup(false);
                  setShowThanks(true);
                }}
                color="primary"
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {showFloorChangePopup && (
          <Dialog
            open={showFloorChangePopup}
            onClose={() => {
              setShowFloorChangePopup(false);
              setCurrentStep(1);
              window.modifyDy = 1;
            }}
            PaperProps={{
              style: {
                borderRadius: 15,
                padding: "20px",
              },
            }}
          >
            <DialogTitle>Floor Change Required</DialogTitle>
            <DialogContent>
              {currentStep === 1 ? (
                <>
                  <img
                    src={LiftStairs}
                    alt="Lift GIF"
                    style={{ width: "100%", marginBottom: "20px" }}
                  />
                  <DialogContentText
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      lineHeight: "1.5",
                    }}
                  >
                    Step 1: Go to the lift/elevator near {previousNodeName}.
                  </DialogContentText>
                </>
              ) : (
                <>
                  <img
                    src={OutsideLift}
                    alt="Floor GIF"
                    style={{ width: "100%", marginBottom: "20px" }}
                  />
                  <DialogContentText
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      lineHeight: "1.5",
                    }}
                  >
                    Step 2: Press continue when reached to floor {nextFloor}.
                  </DialogContentText>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {currentStep === 1 ? (
                <CountdownButton
                  handlePrevious={() => setCurrentStep(2)}
                  buttonText="Next"
                />
              ) : (
                <CountdownButton
                  handlePrevious={() => {
                    setShowFloorChangePopup(false);
                    setCurrentStep(1);
                  }}
                  buttonText="Continue"
                />
              )}
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Navigation;