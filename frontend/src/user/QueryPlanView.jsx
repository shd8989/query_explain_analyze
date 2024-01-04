import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';

const initialNodes = [
  {
    id: 'horizontal-1',
    sourcePosition: 'right',
    type: 'input',
    data: { label: 'Input', title: 'readFile', subline: 'api.ts' },
    position: { x: 0, y: 0 },
  },
  {
    id: 'horizontal-2',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'A Node' },
    position: { x: 200, y: 0 },
  },
  {
    id: 'horizontal-3',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 3' },
    position: { x: 200, y: 80 },
  },
  {
    id: 'horizontal-4',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 4' },
    position: { x: 400, y: 0 },
  },
  {
    id: 'horizontal-5',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 5' },
    position: { x: 400, y: 80 },
  },
  {
    id: 'horizontal-6',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 6' },
    position: { x: 400, y: 160 },
  },
  {
    id: 'horizontal-7',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 7' },
    position: { x: 600, y: 80 },
  },
  {
    id: 'horizontal-8',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 8' },
    position: { x: 600, y: 160 },
  },
];

const initialEdges = [
  {
    id: 'horizontal-e1-2',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-2',
    animated: true,
  },
  {
    id: 'horizontal-e1-3',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-3',
    animated: true,
  },
  {
    id: 'horizontal-e1-4',
    source: 'horizontal-2',
    type: 'smoothstep',
    target: 'horizontal-4',
    label: 'edge label',
  },
  {
    id: 'horizontal-e3-5',
    source: 'horizontal-3',
    type: 'smoothstep',
    target: 'horizontal-5',
    animated: true,
  },
  {
    id: 'horizontal-e3-6',
    source: 'horizontal-3',
    type: 'smoothstep',
    target: 'horizontal-6',
    animated: true,
  },
  {
    id: 'horizontal-e5-7',
    source: 'horizontal-5',
    type: 'smoothstep',
    target: 'horizontal-7',
    animated: true,
  },
  {
    id: 'horizontal-e6-8',
    source: 'horizontal-6',
    type: 'smoothstep',
    target: 'horizontal-8',
    animated: true,
  },
];

const QueryPlanView = ({resultFirst, resultSecond}) => {
  const [nodes1, setNodes1, onNodesChange1] = useNodesState(initialNodes);
  const [nodes2, setNodes2, onNodesChange2] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params) => setEdges((els) => addEdge(params, els)), []);

  const regex = /\ *\-\>/;
  const regex1 = /\]/
  const regex2 = /\-\>/
  const regex3 = /\(cost/

  var nodeArr1 = [];
  var nodeArr2 = [];
  var planDepth = 1;
  var prePlanDepth = 0;
  var yDepth = 0;
  resultFirst.split('\n').filter(line => {
    if(line.substring(1, 2) === '0' || line.match(regex)) {
      if(line.substring(1, 2) === '0') {
        if(line.match(regex2) !== undefined && line.match(regex2) !== null) {
          var nodeId = line.substring(line.match(regex2).index+2, line.match(regex3).index).trim();
          var actualData = line.substring(line.indexOf('actual time'), line.length-1);
          nodeArr1.push({
            id: '0_0',
            sourcePosition: 'right',
            type: 'input',
            data: { label: nodeId + '\n' + actualData },
            position: { x: 0, y: 0 }
          });
        }
      } else if(line.substring(1, 2) > '0') {
        if(line.match(regex2).index !== undefined && line.match(regex2).index > 0) {
          var nodeId = line.substring(line.match(regex2).index+2, line.match(regex3).index).trim();
          var actualData = line.substring(line.indexOf('actual time'), line.length-1);
          planDepth = Number(line.substring(1, line.match(regex1).index));
          yDepth++;
          nodeArr1.push({
            id: planDepth + '_' + nodeId,
            sourcePosition: 'right',
            targetPosition: 'left',
            data: { label: nodeId + '\n' + actualData },
            position: { x: 160*planDepth, y: 80*yDepth }
          });
          prePlanDepth = planDepth;
        }
      }
    }
  });

  useEffect(() => {
    const query_info = async () => {
      setNodes1(nodeArr1);
      setNodes2(nodeArr2);
    }
    query_info();
  }, []);
  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row min500">
            <div className="col">
              <ReactFlow
                nodes={nodes1}
                edges={edges}
                onNodesChange={onNodesChange1}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                style={{whiteSpace: 'pre-wrap'}}
                attributionPosition="bottom-left"
              ></ReactFlow>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default React.memo(QueryPlanView);