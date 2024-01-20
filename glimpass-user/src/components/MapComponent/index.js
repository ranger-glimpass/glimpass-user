import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import allFloorData from "../../data/allFloorData";

function MapComponent() {
  const d3Container = useRef(null);

  useEffect(() => {
    if (allFloorData && d3Container.current) {
      const svg = d3.select(d3Container.current);

      const width = 800,
        height = 600;
      const centerX = width / 2,
        centerY = height / 2;
      const radius = 250; // Radius for positioning nodes

      // Calculate the angle for each node based on its index
      const angleIncrement = (2 * Math.PI) / allFloorData.nodes.length;

      // Create coordinates for each node
      const nodesWithCoordinates = allFloorData.nodes.map((node, index) => {
        const angle = index * angleIncrement;
        return {
          ...node,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        };
      });

      // Draw nodes
      svg
        .selectAll(".node")
        .data(nodesWithCoordinates)
        .join("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("fill", "blue");

      // Optionally, add labels to the nodes
      svg
        .selectAll(".node-label")
        .data(nodesWithCoordinates)
        .join("text")
        .attr("class", "node-label")
        .attr("x", (d) => d.x + 10)
        .attr("y", (d) => d.y + 5)
        .text((d) => d.name)
        .attr("font-size", "10px")
        .attr("fill", "black");
    }
  }, []);

  return (
    <svg className="d3-component" width={800} height={600} ref={d3Container} />
  );
}

export default MapComponent;
