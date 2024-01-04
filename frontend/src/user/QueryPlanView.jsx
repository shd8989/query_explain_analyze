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

  const regex = /\[[0]\]/;
  const regex1 = /\]/
  const regex2 = /\-\>/
  const regex3 = /\(cost/

  var nodeArr1 = [];
  var node1Cnt = 0;
  var nodeArr2 = [];
  var node2Cnt = 0;
  var edgeArr = [];
  var edgeCnt = 1;
  var planDepth = 1;
  var prePlanDepth = 0;
  var depthMap = new Map;
  var yDepth = 0;
  resultFirst.split('\n').filter(line => {
    if(line.substring(1, 2) === '0') {
      if(line.match(regex) !== undefined && line.match(regex) !== null) {
        var nodeId = line.substring(line.match(regex).index+3, line.match(regex3).index).trim();
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
      if(line.match(regex2) !== undefined && line.match(regex2) !== null) {
        var nodeId = line.substring(line.match(regex2).index+2, line.match(regex3).index).trim();
        var actualData = line.substring(line.indexOf('actual time'), line.length-1);
        planDepth = Number(line.substring(1, line.match(regex1).index));
        yDepth++;
        depthMap.set(planDepth, node1Cnt);
        nodeArr1.push({
          id: planDepth + '_' + depthMap.get(planDepth),
          sourcePosition: 'right',
          targetPosition: 'left',
          data: { label: nodeId + '\n' + actualData },
          position: { x: 160*planDepth, y: 80*yDepth }
        });
        // edge 연결할때 - 깊이 탐색하듯이 고려
        // 1. prePlanDepth보다 크면 prePlanDepth node를 start node로 planDepth 노드를 end node로 설정
        // 2. prePlanDepth와 plandepth가 같다면 match등을 활용하여 이전 노드의 id를 찾아 start node로 설정
        // 2.1. 아니면 pre2PlanDepth로해서 두번째 이전의 planDepth를 저장하여 start node를 설정
        // 2.2. 아니면 depth 정보를 map에 저장하여 사용
        // 3. prePlanDepth보다 작다면 match등을 활용하여 이전 노드 중 가까운 상위 노드의 id를 찾아 start node로 설정
        // 3.1. 아니면 depth 정보를 map에 저장하여 사용
        if(planDepth > prePlanDepth) {
        //   // var startNode = nodeArr1.filter((node) => console.log(node))
        //   // var endNode = nodeArr1.filter((node) => console.log(node))

        //   // edgeArr.push({
        //   //   id: 'edge_' + edgeCnt,
        //   //   source: startNode,
        //   //   target: endNode,
        //   //   type: 'smoothstep',
        //   //   animated: true
        //   // })
          node1Cnt = 0;
        } else if(planDepth === prePlanDepth) {
          if(depthMap.has(planDepth)) {
            depthMap.set(planDepth, depthMap.get(planDepth)+1);
            console.log('=== has', depthMap);
          }
          node1Cnt++;
        } else {
          if(depthMap.has(planDepth)) {
            depthMap.set(planDepth, depthMap.get(planDepth)+1);
            console.log('< has', depthMap);
          }
          node1Cnt++;
        }
        console.log(planDepth, prePlanDepth, depthMap.get(planDepth));
        prePlanDepth = planDepth;
        // edgeCnt++;
      }
    }
  });
  console.log(nodes1);

  // planDepth = 1;
  // prePlanDepth = 0;
  // yDepth = 0;
  // resultSecond.split('\n').filter(line => {
  //   if(line.substring(1, 2) === '0' || line.match(regex)) {
  //     if(line.substring(1, 2) === '0') {
  //       if(line.match(regex2).index !== undefined && line.match(regex2).index > 0) {
  //         var nodeId = line.substring(line.match(regex2).index+2, line.match(regex3).index).trim();
  //         var actualData = line.substring(line.indexOf('actual time'), line.length-1);
  //         nodeArr2.push({
  //           id: nodeId.replace(' ', '_') + '_0',
  //           sourcePosition: 'right',
  //           type: 'input',
  //           data: { label: nodeId + '\n' + actualData },
  //           position: { x: 0, y: 0 }
  //         });
  //       }
  //     } else if(line.substring(1, 2) > '0') {
  //       if(line.match(regex2).index !== undefined && line.match(regex2).index > 0) {
  //         var nodeId = line.substring(line.match(regex2).index+2, line.match(regex3).index).trim();
  //         var actualData = line.substring(line.indexOf('actual time'), line.length-1);
  //         planDepth = Number(line.substring(1, line.match(regex1).index));
  //         yDepth++;
  //         nodeArr2.push({
  //           id: nodeId.replace(' ', '_') + '_' + planDepth,
  //           sourcePosition: 'right',
  //           targetPosition: 'left',
  //           data: { label: nodeId + '\n' + actualData },
  //           position: { x: 160*planDepth, y: 80*yDepth }
  //         });
  //         prePlanDepth = planDepth;
  //       }
  //     }
  //   }
  // });

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