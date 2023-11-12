import React, { useState, useEffect, useRef } from "react";
import navigationArrow from "../assets/navigationArrow.svg";
import CustomProgressBar from "../components/CustomProgressBar";
import NavigationButtons from "./NavigationButtons";
import {
  Button,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
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

import useMediaQuery from "@mui/material/useMediaQuery";
window.currentStep = 0;
window.modifyDy = 1;

//steps calculation

const globalArray = [];
const globalTimeArray = [];
const Navigation = () => {
  const navigate = useNavigate();

  const navigateToShops = (event) => {
    window.location.href = "/markets";
  };

  const svgWidth = 400;
  const svgHeight = 400;
  const scaleFactor = 3;

  const pathRef = useRef(null);
  const location = useLocation();
  const currentLocation = location.state.currentLocation;
  const calibratedShopAngle = location.state?.calibratedShopAngle || 0;
  const destinationShopId = location.state.destinationShopId;
  const [conn, setConn] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshed, setIsRefreshed] = useState(true);
  const [turnAngle, setTurnAngle] = useState(false);
  const [showFloorChangePopup, setShowFloorChangePopup] = useState(false);
  const [nextFloor, setNextFloor] = useState(null);
  const [selectedShopCoords, setSelectedShopCoords] = useState(null);
  const [nodeSelected, setNodeSelected] = useState(false);

  const [destinationName, setDestinationName] = useState(destinationShopId);
  const [stepsWalked, setStepsWalked] = useState(0);
  const [selectedShopIndex, setSelectedShopIndex] = useState(0);

  const changeSlectedIndexDynamic = (index) => {
    console.log(index, "manish");
    setSelectedShopIndex(index);
  };
  useEffect(() => {
    // Check if the page was loaded via a refresh
    if (
      window.performance &&
      window.performance.navigation.type ===
        window.performance.navigation.TYPE_RELOAD
    ) {
      // Redirect to the shops page
      console.log("refreshed!!!!!!!!!!!!!!!!");
      window.location.href = "/markets";
    }
  }, []);

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

          // Check if the data is empty or not in the desired format
          if (!data || data.length === 0) {
            alert("No route found!");
            navigate("/shops"); // Assuming '/shops' is the route for the shops page
            return;
          }

          setConn(data); // Assuming the API returns the data in the desired format
          console.log(data, "shortest path");

          const lastShop = conn[conn.length - 1]?.name;
          setDestinationName(lastShop);

          // Find the first shop and set it as the active shop
          const firstShop = data.find(
            (item) => item.shopOrCheckpoint?.type === "shop"
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

  const reachRef = useRef("here");

  const handleMotion = (event) => {
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
    calibratedAlpha = (calibratedAlpha - calibratedShopAngle + 360) % 360;
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
      conn[i].nodeType === "washroom" ||
      conn[i].nodeType === "checkpoint" ||
      conn[i].nodeType === "floor_change"
    ) {
      const shopOrCheckpoint = conn[i];
      const connection = conn[i + 1];
      route.push({ shopOrCheckpoint, connection });
      i++; // Increment by one more to skip the connection object
    }
  }
  console.log(route, "route");
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
      // const initialAdjustedAngle = (alpha + initialNextShopAngle - 45) % 360;
      // initialNextShopAngle =
      //   (360 + initialNextShopAngle + calibratedShopAngle) % 360;
      const initialAdjustedAngle = (alpha + initialNextShopAngle) % 360;

      setAdjustedAng(initialAdjustedAngle);
    } else {
      let initialNextShopAngle = currentRoute[0]?.connection?.angle || 0;
      //const initialAdjustedAngle = (alpha + initialNextShopAngle - 45) % 360;
      // initialNextShopAngle =
      //   (360 + initialNextShopAngle + calibratedShopAngle) % 360;
      const initialAdjustedAngle = (alpha + initialNextShopAngle) % 360;

      setAdjustedAng(initialAdjustedAngle);
    }

    setTotalStep(initialTotalSteps);
    setCurrentWalkAngle(currentRoute[0]?.connection?.angle || 0);
    setNextNodeAngle(currentRoute[1]?.connection?.angle || 0);
  }, [currentRoute, alpha]);

  useEffect(() => {
    if (currentRoute.length === 1) {
      setShowReachedPopup(true);
    }
    globalArray.push(360 - alpha);
    globalTimeArray.push(new Date().getSeconds());

    const len = globalArray.length;
    if (len > 3) {
      const averageAngle =
        (globalArray[len - 1] + globalArray[len - 2] + globalArray[len - 3]) /
        3;

      const timeDiffInterval =
        (60 + globalTimeArray[len - 3] - globalTimeArray[len - 1]) % 60;
      const percentageError = 15;

      let angleDiff = Math.abs(currentWalkAngle - nextNodeAngle);
      let angleDiff2 = Math.abs(180 - angleDiff);
      angleDiff = Math.min(angleDiff, angleDiff2);
      straightPath.current = angleDiff <= 15;

      if (
        averageAngle >= currentWalkAngle - percentageError &&
        averageAngle <= currentWalkAngle + percentageError
      ) {
        // true walking in right direction;
        reachRef.current = "ok walk position";
      } else if (
        averageAngle >= nextNodeAngle - percentageError &&
        averageAngle <= nextNodeAngle + percentageError &&
        timeDiffInterval >= 1
      ) {
        // turns or not
        // signal to path.js
        setTurnAngle(true);
        reachRef.current = "turn angle is true";
      } else {
        reachRef.current = "inside else condition";
      }
    }
  }, [stepsV2.current]);
  // manish

  const floorPopupfn = () => {
    const currentNodeType = currentRoute[1]?.shopOrCheckpoint?.nodeType;

    let nextNode = currentRoute[2]?.shopOrCheckpoint;

    let j = 2;
    while (j < currentRoute.length && nextNode?.nodeType === "checkpoint") {
      nextNode = currentRoute[j]?.shopOrCheckpoint;
      j++;
    }
    if (currentNodeType === "floor_change" && nextNode) {
      setShowFloorChangePopup(true);
      window.modifyDy = 0;
      setNextFloor(nextNode?.floor);
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
      setCurrentRoute((prevRoute) => prevRoute.slice(1));
      lastRecordedStep.current = dy; // Reset the step count
    } else if (dy - lastRecordedStep.current >= stepsToNextShop) {
      floorPopupfn();
      if (currentRoute.length === 2) {
        setCurrentRoute((prevRoute) => prevRoute.slice(1));
      } else if (currentRoute.length == 1) {
        setShowReachedPopup(true);
      }

      window.modifyDy = 0;
      setTurnAngle(false);
      if (straightPath.current) {
        reachRef.current = "turn angle is true";
        setTurnAngle(true);
      }
    } else if (turnAngle) {
      window.modifyDy = stepsToNextShop - (dy - lastRecordedStep.current);
    }

    // setCurrentShop(currentRoute[0].shopOrCheckpoint?.name);
  }, [dy, currentRoute, turnAngle]);

  const handleDropdownChange = (selectedShopName) => {
    const selectedIndex = route.findIndex(
      (item) => item.shopOrCheckpoint.name === selectedShopName
    );
    setCurrentRoute(route.slice(selectedIndex));

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
      (item) => item.shopOrCheckpoint.name === selectedShopName
    );
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
    setRemainingSteps((prevSteps) => Math.max(0, prevSteps - stepsTaken));

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
      step: progressToThisPoint,
      anglesIn: anglesIn,
    };
  });
  const resetSteps = (index) => {
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
  }, [selectedShopIndex]);

  let flattenedRoute = [];
  route.forEach((item) => {
    flattenedRoute.push(item.shopOrCheckpoint);
    if (item.connection) {
      flattenedRoute.push(item.connection);
    }
  });

  //console.log("routeF: ",flattenedRoute)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [viewBox, setViewBox] = useState("0 0 500 300");

  useEffect(() => {
    if (isRefreshed && route.length > 0) {
      handleDropdownChange(route[0].shopOrCheckpoint?.name);
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

  //   return isLoading ? (
  //     <div
  //       style={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <CircularProgress />
  //     </div>
  //   ) : showThanks ? (
  //     <ThanksComponent
  //       route={directionsAndShops}
  //       stepsWalked={dy}
  //       totalSteps={totalSteps}
  //     />
  //   ) : (
  //     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
  //       {/* Dropdown at top right */}
  //       <div style={{ alignSelf: "flex-end", margin: "10px" }}>
  //         <Typography
  //           variant="h6"
  //           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  //         >
  //           📍 {currentRoute[0]?.shopOrCheckpoint?.name || "In between"}
  //         </Typography>

  //         {/* {isRefreshed &&(
  //   handleDropdownChange(currentRoute[0]?.shopOrCheckpoint?.name)
  // )} */}
  //         {isDropdownOpen && (
  //           <List>
  //             {route.map((item, index) => (
  //               <ListItem
  //                 key={index}
  //                 button
  //                 selected={
  //                   currentRoute[0]?.shopOrCheckpoint?.name ===
  //                   item.shopOrCheckpoint?.name
  //                 }
  //                 onClick={() => {
  //                   handleDropdownChange(item.shopOrCheckpoint?.name);
  //                   setIsDropdownOpen(false);
  //                 }}
  //               >
  //                 <ListItemText primary={item.shopOrCheckpoint?.name} />
  //               </ListItem>
  //             ))}
  //           </List>
  //         )}
  //       </div>
  //       {/* <div style={{ marginTop: "20px" }}>
  //         <Button
  //           variant="contained"
  //           color="primary"
  //           onClick={() => {
  //             steps.current++;
  //             stepsV2.current++;
  //             setdy(steps.current);
  //           }}
  //         >
  //           Add steps mannualy
  //         </Button>
  //       </div> */}
  //       {/* <div>
  //         {/* {averageAngle && <p>{averageAngle}</p>}
  //         <p>{turnAngle ? "Trueeee" : "Falseeee"}</p>
  //         <p>{reachRef.current}</p>
  //         <p>{currentWalkAngle}</p>
  //         <p>{nextNodeAngle}</p>
  //         <p>{adjustedAng}</p>
  //       </div> */}

  // <Typography variant="h5" gutterBottom>
  //           Navigation to {destinationName}
  //         </Typography>

  //       {/* SVG Map */}
  //       <div
  //         // onTouchStart={handleTouchStart}
  //         // onTouchMove={handleTouchMove}
  //         // style={{
  //         //   flexGrow: 1,
  //         //   display: "flex",
  //         //   justifyContent: "center",
  //         //   alignItems: "center",
  //         // }}
  //       >
  //         <SvgIcon
  //           viewBox="0 0 500 500"
  //           style={{
  //             border: "1px solid red",
  //             margin: "20px 0",
  //             width: "80%",
  //             height: "80%",
  //           }}
  //         >
  //           <Path
  //             route={flattenedRoute}
  //             ref={pathRef}
  //             setViewBox={setViewBox}
  //             stepsWalked={dy}
  //             totalSteps={totalSteps}
  //             adjustedAng={adjustedAng}
  //           />
  //         </SvgIcon>
  //       </div>

  //        {/* Use CustomProgressBar, passing the necessary props to it */}
  //        <CustomProgressBar shops={shopsData} stepsWalked={dy} totalSteps={totalSteps} />

  //       <div
  //         style={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           padding: "20px",
  //         }}
  //       >
  //         <img
  //           src={navigationArrow}
  //           alt="Navigation Arrow"
  //           style={{
  //             transform: `rotate(${adjustedAng}deg)`,
  //             width: "50px", // Adjust this value as needed
  //             height: "50px", // Adjust this value as needed
  //           }}
  //         />
  //       </div>

  //       {/* Route Details */}
  //       <div style={{ padding: "20px" }}>

  //         <Typography
  //           variant="body1"
  //           style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0" }}
  //         >
  //           Steps: {dy}
  //         </Typography>

  //         {/* <Typography variant="h6" gutterBottom>
  //           Route:
  //         </Typography> */}
  //         {/* <div>
  //           {currentRoute.slice(0, 2).map((item, index) => (
  //             <Typography key={index} variant="body1" gutterBottom>
  //               {index === 0
  //                 ? `📍 Now at: ${item.shopOrCheckpoint?.name}`
  //                 : item.shopOrCheckpoint?.type === "shop"
  //                 ? `👉 Next shop: ${item.shopOrCheckpoint?.name}`
  //                 : `Take ${getDirection(
  //                     item.connection?.angle,
  //                     dy
  //                   )} in next ${remainingSteps} steps`}
  //             </Typography>
  //           ))}
  //         </div> */}

  //         <Typography variant="h6" gutterBottom>
  //           Total Steps: {Math.max(0, totalStep - dy + lastRecordedStep.current)}
  //         </Typography>

  //         {/* Button at the bottom */}
  //         <div style={{ marginTop: "20px" }}>
  //           <Button variant="contained" color="primary" onClick={navigateToShops}>
  //             Navigate other shops
  //           </Button>
  //         </div>
  //       </div>

  //       {showReachedPopup && (
  //         <Dialog
  //           open={showReachedPopup}
  //           onClose={() => setShowReachedPopup(false)}
  //         >
  //           <DialogTitle>Confirmation</DialogTitle>
  //           <DialogContent>
  //             <DialogContentText>
  //               Did you reach {currentRoute[0]?.shopOrCheckpoint?.name}?
  //             </DialogContentText>
  //           </DialogContent>
  //           <DialogActions>
  //             <Button onClick={() => setShowReachedPopup(false)} color="primary">
  //               No
  //             </Button>
  //             <Button
  //               onClick={() => {
  //                 setShowReachedPopup(false);
  //                 setShowThanks(true);
  //               }}
  //               color="primary"
  //             >
  //               Yes
  //             </Button>
  //           </DialogActions>
  //         </Dialog>
  //       )}

  //       {showFloorChangePopup && (
  //         <Dialog
  //           open={showFloorChangePopup}
  //           onClose={() => setShowFloorChangePopup(false)}
  //         >
  //           <DialogTitle>Floor Change Required</DialogTitle>{" "}
  //           <DialogContent>
  //             {" "}
  //             <DialogContentText>
  //               Proceed to the lift and go to floor {nextFloor}.{" "}
  //             </DialogContentText>{" "}
  //           </DialogContent>{" "}
  //           <DialogActions>
  //             {" "}
  //             <Button
  //               onClick={() => setShowFloorChangePopup(false)}
  //               color="primary"
  //             >
  //               OK{" "}
  //             </Button>{" "}
  //           </DialogActions>{" "}
  //         </Dialog>
  //       )}
  //     </div>
  //   );
  // };

  const [currentStep, setCurrentStep] = useState(1);
  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </div>
  ) : showThanks ? (
    <ThanksComponent
      route={directionsAndShops}
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
          <div
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
            )} */}
          </div>
        </div>

        {/* <div style={{ marginTop: "20px" }}>
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
        </div> */}

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
        <div style={{ marginBottom: "10px", marginTop: "100px" }}>
          <img
            src={navigationArrow}
            alt="Navigation Arrow"
            style={{
              transform: `rotate(${adjustedAng}deg)`,
              width: "250px",
              height: "250px",
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
              setCurrentStep(1); // Reset the step when closing the modal
              window.modifyDy = 1;
            }}
            PaperProps={{
              style: {
                borderRadius: 15, // Rounded corners
                padding: "20px",
              },
            }}
          >
            <DialogTitle>Floor Change Required</DialogTitle>
            <DialogContent>
              {currentStep === 1 ? (
                <>
                  <img
                    src="path_to_your_gif_1.gif"
                    alt="Lift GIF"
                    style={{ width: "100%", marginBottom: "20px" }}
                  />
                  <DialogContentText>
                    Step 1: Go to the lift/elevator.
                  </DialogContentText>
                </>
              ) : (
                <>
                  <img
                    src="path_to_your_gif_2.gif"
                    alt="Floor GIF"
                    style={{ width: "100%", marginBottom: "20px" }}
                  />
                  <DialogContentText>
                    Step 2: Press continue when reached to floor {nextFloor}.
                  </DialogContentText>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {currentStep === 1 ? (
                <Button
                  onClick={() => setCurrentStep(2)}
                  color="primary"
                  variant="contained"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowFloorChangePopup(false);
                    setCurrentStep(1); // Reset the step after closing the modal
                  }}
                  color="primary"
                  variant="contained"
                >
                  Continue
                </Button>
              )}
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Navigation;
