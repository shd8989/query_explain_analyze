import React, {useCallback, useEffect, useState} from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';

const QueryPlanView = ({resultFirst, resultSecond}) => {
  const [nodes1, setNodes1] = useNodesState([]);
  const [nodes2, setNodes2] = useNodesState([]);
  const [edges1, setEdges1] = useEdgesState([]);
  const [edges2, setEdges2] = useEdgesState([]);
  // const onConnect = useCallback((params) => setEdges1((els) => addEdge(params, els)), []);

  const regex = /\[[0]\]/;
  const regex1 = /\]/
  const regex2 = /\-\>/
  const regex3 = /\(cost/

  var node1Arr = [];
  var node2Arr = [];
  var edge1Arr = [];
  var edge2Arr = [];
  var planDepth = 1;
  var prePlanDepth = 0;
  var preNodeId = '0_0';
  var depthMap = new Map;
  var yDepth = 0;
  resultFirst.split('\n').filter(line => {
    if(line.substring(1, 2) === '0') {
      if(line.match(regex) !== undefined && line.match(regex) !== null) {
        var nodeLabel = line.substring(line.match(regex).index+3, line.match(regex3).index).trim();
        var actualData = line.substring(line.indexOf('actual time'), line.length-1);
        node1Arr.push({
          id: '0_0',
          sourcePosition: 'right',
          type: 'input',
          data: { label: nodeLabel + '\n' + actualData },
          position: { x: 0, y: 0 }
        });
        depthMap.set(0, 0);
      }
    } else if(line.substring(1, 2) > '0') {
      if(line.match(regex2) !== undefined && line.match(regex2) !== null) {
        var nodeLabel = line.substring(line.match(regex2).index+2, line.match(regex3).index).trim();
        var actualData = line.substring(line.indexOf('actual time'), line.length-1);
        planDepth = Number(line.substring(1, line.match(regex1).index));
        yDepth++;
        
        if(depthMap.has(planDepth)) {
          depthMap.set(planDepth, depthMap.get(planDepth)+1);
        } else {
          depthMap.set(planDepth, depthMap.get(planDepth) !== undefined ? depthMap.get(planDepth) : 0);
        }
        
        if(planDepth > prePlanDepth) {
          preNodeId = prePlanDepth + '_' + depthMap.get(prePlanDepth);
        } else if(planDepth === prePlanDepth) {
          preNodeId = (prePlanDepth-1) + '_' + (depthMap.get(prePlanDepth-1));
        } else {
          preNodeId = depthMap.get(planDepth-1) + '_' + depthMap.get(prePlanDepth);
        }

        node1Arr.push({
          id: planDepth + '_' + depthMap.get(planDepth) + '-' + preNodeId,
          sourcePosition: 'right',
          targetPosition: 'left',
          data: { label: nodeLabel + '\n' + actualData },
          position: { x: 180*planDepth, y: 80*yDepth*(planDepth === prePlanDepth ? 1.1 : 1) }
        });
        prePlanDepth = planDepth
      }
    }
  });

  planDepth = 1;
  prePlanDepth = 0;
  preNodeId = '0_0';
  depthMap = new Map;
  yDepth = 0;
  resultSecond.split('\n').filter(line => {
    if(line.substring(1, 2) === '0') {
      if(line.match(regex) !== undefined && line.match(regex) !== null) {
        var nodeLabel = line.substring(line.match(regex).index+3, line.match(regex3).index).trim();
        var actualData = line.substring(line.indexOf('actual time'), line.length-1);
        node2Arr.push({
          id: '0_0',
          sourcePosition: 'right',
          type: 'input',
          data: { label: nodeLabel + '\n' + actualData },
          position: { x: 0, y: 0 }
        });
        depthMap.set(0, 0);
      }
    } else if(line.substring(1, 2) > '0') {
      if(line.match(regex2) !== undefined && line.match(regex2) !== null) {
        var nodeLabel = line.substring(line.match(regex2).index+2, line.match(regex3).index).trim();
        var actualData = line.substring(line.indexOf('actual time'), line.length-1);
        planDepth = Number(line.substring(1, line.match(regex1).index));
        yDepth++;
        
        if(depthMap.has(planDepth)) {
          depthMap.set(planDepth, depthMap.get(planDepth)+1);
        } else {
          depthMap.set(planDepth, depthMap.get(planDepth) !== undefined ? depthMap.get(planDepth) : 0);
        }
        
        if(planDepth > prePlanDepth) {
          preNodeId = prePlanDepth + '_' + depthMap.get(prePlanDepth);
        } else if(planDepth === prePlanDepth) {
          preNodeId = (prePlanDepth-1) + '_' + (depthMap.get(prePlanDepth-1));
        } else {
          preNodeId = depthMap.get(planDepth-1) + '_' + depthMap.get(prePlanDepth);
        }

        node2Arr.push({
          id: planDepth + '_' + depthMap.get(planDepth) + '-' + preNodeId,
          sourcePosition: 'right',
          targetPosition: 'left',
          data: { label: nodeLabel + '\n' + actualData },
          position: { x: 180*planDepth, y: 80*yDepth*(planDepth === prePlanDepth ? 1.1 : 1) }
        });
        prePlanDepth = planDepth
      }
    }
  });

  for(var i=1; i<node1Arr.length; i++) {
    var stNode = node1Arr.filter(node => node.id.indexOf(node1Arr[i].id.split("-")[1])===0);
    edge1Arr.push({
      id: 'edge_' + stNode[0].id + '_' + node1Arr[i].id,
      source: stNode[0].id,
      target: node1Arr[i].id,
      type: 'smoothstep',
      animated: true
    });
  }

  for(var i=1; i<node2Arr.length; i++) {
    var stNode = node2Arr.filter(node => node.id.indexOf(node2Arr[i].id.split("-")[1])===0);
    edge2Arr.push({
      id: 'edge_' + stNode[0].id + '_' + node2Arr[i].id,
      source: stNode[0].id,
      target: node2Arr[i].id,
      type: 'smoothstep',
      animated: true
    });
  }

  const onNodesChange1 = async() => {
    setNodes1(node1Arr);
  }

  const onNodesChange2 = async() => {
    setNodes2(node2Arr);
  }

  const onEdgesChange1 = async() => {
    for(var i=0; i<edge1Arr.length; i++) {
      var edge = edge1Arr[i];
      setEdges1((edge) => addEdge(edge, edge1Arr));
    }
  }

  const onEdgesChange2 = async() => {
    for(var i=0; i<edge2Arr.length; i++) {
      var edge = edge2Arr[i];
      setEdges2((edge) => addEdge(edge, edge2Arr));
    }
  }

  useEffect(() => {
    onNodesChange1();
  }, []);

  useEffect(() => {
    onNodesChange2();
  }, []);

  useEffect(() => {
    onEdgesChange1();
  }, []);

  useEffect(() => {
    onEdgesChange2();
  }, []);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <div className="row min500">
            <div className="col">
              <ReactFlow
                nodes={nodes1}
                edges={edges1}
                onNodesChange={onNodesChange1}
                onEdgesChange={onEdgesChange1}
                fitView
                style={{whiteSpace: 'pre-wrap'}}
                attributionPosition="bottom-left"
              ></ReactFlow>
            </div>
            <div className="col">
              <ReactFlow
                nodes={nodes2}
                edges={edges2}
                onNodesChange={onNodesChange2}
                onEdgesChange={onEdgesChange2}
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