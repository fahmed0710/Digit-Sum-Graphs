"use client"
import React, { useState } from 'react';
import { GraphNode } from "@/app/components/GraphNode"

export default function Puzzle() {
  const [node1, setNode1] = useState(0);
  const [node2, setNode2] = useState(18);
  const [node3, setNode3] = useState(0);

  return (
    <div>
      <h1>Graph 1</h1>
      
      <GraphNode initialNode={ false } value={ node1 } setValue={ setNode1 } />
      <GraphNode initialNode={ true } value={ node2 } setValue={ setNode2 } />
      <GraphNode initialNode={ false } value={ node3 } setValue={ setNode3 } />
      
      <button>Submit Solution</button>
    </div>
  )
}