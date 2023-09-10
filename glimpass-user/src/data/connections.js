const connections = [
    { from: 1, to: 2, angle: 0, steps: 10 },
    { from: 2, to: 3, angle: 45, steps: 8 },
    { from: 3, to: 4, angle: 90, steps: 12 },
    { from: 4, to: 5, angle: 135, steps: 7 },
    { from: 5, to: 6, angle: 180, steps: 10 },
    { from: 6, to: 7, angle: 225, steps: 9 },
    { from: 7, to: 8, angle: 270, steps: 11 },
    { from: 8, to: 9, angle: 315, steps: 6 },
    { from: 9, to: 10, angle: 0, steps: 10 },
    { from: 10, to: 11, angle: 45, steps: 8 },
    { from: 11, to: 12, angle: 90, steps: 7 },
    { from: 12, to: 13, angle: 135, steps: 9 },
    { from: 13, to: 14, angle: 180, steps: 10 },
    { from: 14, to: 15, angle: 225, steps: 8 },
    { from: 15, to: 16, angle: 270, steps: 12 },
    { from: 16, to: 17, angle: 315, steps: 7 },
    { from: 17, to: 18, angle: 0, steps: 11 },
    { from: 18, to: 19, angle: 45, steps: 9 },
    { from: 19, to: 20, angle: 90, steps: 10 },
    { from: 20, to: 1, angle: 135, steps: 8 }, // Looping back to the start for a circular connection
];

export default connections;
